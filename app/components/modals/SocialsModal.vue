<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
    SOCIAL_PLATFORMS,
    validateSocialUrl,
    type SocialPlatform,
} from "~/utils/socialPlatforms";
import { navigationVariants } from "~/variants/NavigationVariants";
import {
    PhMagnifyingGlass,
    PhArrowLeft,
    PhTrash,
    PhWarning,
} from "@phosphor-icons/vue";

interface Props {
    modelValue: boolean;
    platform?: string; // For editing
    url?: string; // For editing
    title?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    platform: "",
    url: "",
    title: "Add Social Link",
    confirmText: "Save",
    cancelText: "Cancel",
    isLoading: false,
});

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    confirm: [data: { platform: string; url: string }];
    cancel: [];
    delete: [];
}>();

// Local state
const search = ref("");
const selectedSocial = ref<SocialPlatform | null>(null);
const localUrl = ref("");
const currentStep = ref<"select" | "form" | "delete">("select");

// Computed
const isEditMode = computed(() => !!props.platform);

const modalTitle = computed(() => {
    if (currentStep.value === "delete") {
        return "Delete Social Link";
    }

    if (selectedSocial.value) {
        return isEditMode.value
            ? `Edit ${selectedSocial.value.name}`
            : `Add ${selectedSocial.value.name}`;
    }
    return props.title;
});

const filteredSocials = computed(() => {
    if (!search.value.trim()) {
        return SOCIAL_PLATFORMS;
    }

    const searchLower = search.value.toLowerCase();
    return SOCIAL_PLATFORMS.filter(
        (social) =>
            social.name.toLowerCase().includes(searchLower) ||
            social.key.toLowerCase().includes(searchLower)
    );
});

const isUrlValid = computed(() => {
    if (!localUrl.value.trim()) return true;
    if (!selectedSocial.value) return true;
    return validateSocialUrl(selectedSocial.value.key, localUrl.value);
});

const isFormValid = computed(() => {
    return localUrl.value.trim().length > 0 && isUrlValid.value;
});

// Handlers
const resetForm = () => {
    setTimeout(() => {
        selectedSocial.value = null;
        localUrl.value = "";
        search.value = "";
        currentStep.value = "select";
    }, 150);
};

const selectSocial = (social: SocialPlatform) => {
    selectedSocial.value = social;
    search.value = "";
    currentStep.value = "form";
};

const goBack = () => {
    if (currentStep.value === "delete") {
        currentStep.value = "form";
    } else if (!props.platform) {
        selectedSocial.value = null;
        localUrl.value = "";
        currentStep.value = "select";
    }
};

const handleClose = () => {
    if (!props.isLoading) {
        emit("update:modelValue", false);
        emit("cancel");
        resetForm();
    }
};

const handleConfirm = () => {
    if (!isFormValid.value || !selectedSocial.value) {
        return;
    }

    emit("confirm", {
        platform: selectedSocial.value.key,
        url: localUrl.value.trim(),
    });
};

const handleDelete = () => {
    currentStep.value = "delete";
};

const confirmDelete = () => {
    emit("delete");
};

// Sync props to local state when modal opens
watch(
    () => props.modelValue,
    (isOpen) => {
        if (isOpen) {
            localUrl.value = props.url;

            // If editing, auto-select the platform
            if (props.platform) {
                const platform = SOCIAL_PLATFORMS.find(
                    (s) => s.key === props.platform
                );
                if (platform) {
                    selectedSocial.value = platform;
                    currentStep.value = "form";
                }
            } else {
                currentStep.value = "select";
            }
        } else {
            resetForm();
        }
    },
    { immediate: true }
);

// Handle Enter key
const handleUrlKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (isFormValid.value && !props.isLoading) {
            handleConfirm();
        }
    }
};
</script>

<template>
    <Modal
        :modelValue="modelValue"
        :title="modalTitle"
        size="xl"
        :closeOnBackdrop="!isLoading"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <!-- Step 1: Platform Selection -->
        <div v-if="currentStep === 'select'" class="flex flex-col gap-y-3">
            <!-- Search Input -->
            <div class="relative">
                <Input
                    type="text"
                    v-model="search"
                    placeholder="Search platforms..."
                    :disabled="isLoading"
                    autocomplete="off"
                >
                    <PhMagnifyingGlass class="size-5 text-stone-400" />
                </Input>
            </div>

            <!-- Platforms List -->
            <div
                class="flex flex-col gap-y-1 h-72 max-h-72 overflow-y-auto no-scrollbar"
            >
                <div
                    v-if="filteredSocials.length === 0"
                    class="text-center py-8 text-sm text-stone-500 dark:text-stone-400"
                >
                    No platforms found
                </div>

                <button
                    v-for="social in filteredSocials"
                    :key="social.key"
                    @click="selectSocial(social)"
                    :disabled="isLoading"
                    :class="
                        cn(
                            navigationVariants({
                                variant: 'primary',
                            }),
                            'py-3 font-sans tracking-normal text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                        )
                    "
                >
                    <div class="flex items-center gap-x-3 min-w-0">
                        <component :is="social.icon" class="size-6 shrink-0" />
                        <p class="truncate">{{ social.name }}</p>
                    </div>
                </button>
            </div>
        </div>

        <!-- Step 2: URL Form -->
        <div
            v-else-if="currentStep === 'form' && selectedSocial"
            class="flex flex-col gap-y-4"
        >
            <!-- Back Button (only if not editing) -->
            <button
                v-if="!isEditMode"
                @click="goBack"
                class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                :disabled="isLoading"
            >
                <PhArrowLeft class="size-4" />
                <span>Back to platforms</span>
            </button>

            <!-- Selected Platform Display -->
            <div
                class="flex items-center gap-3 p-4 bg-stone-50 dark:bg-dark-800 rounded-xl border border-stone-200 dark:border-dark-700"
            >
                <component :is="selectedSocial.icon" class="size-6 shrink-0" />

                <div>
                    <p class="font-semibold text-stone-900 dark:text-stone-100">
                        {{ selectedSocial.name }}
                    </p>
                    <p class="text-xs text-stone-500 dark:text-stone-400">
                        {{ isEditMode ? "Editing link" : "Adding new link" }}
                    </p>
                </div>
            </div>

            <!-- URL Input -->
            <Field
                id="social-url"
                label="URL"
                required
                :error="
                    localUrl.trim() && !isUrlValid
                        ? 'Please enter a valid URL for this platform'
                        : undefined
                "
            >
                <Input
                    id="social-url"
                    v-model="localUrl"
                    type="url"
                    :placeholder="selectedSocial.placeholder"
                    :disabled="isLoading"
                    autocomplete="url"
                    @keydown="handleUrlKeydown"
                />
                <template #hint>
                    <span class="text-xs text-stone-500 dark:text-stone-400">
                        Enter the full URL including https://
                    </span>
                </template>
            </Field>

            <!-- Example -->
            <div
                class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
                <p class="text-xs text-blue-800 dark:text-blue-300">
                    <span class="font-semibold">Example:</span>
                    {{ selectedSocial.placeholder }}
                </p>
            </div>

            <!-- Delete Button (only in edit mode) -->
            <button
                v-if="isEditMode"
                @click="handleDelete"
                :disabled="isLoading"
                class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <PhTrash class="size-4" />
                <span>Delete this social link</span>
            </button>
        </div>

        <!-- Step 3: Delete Confirmation -->
        <div
            v-else-if="currentStep === 'delete' && selectedSocial"
            class="flex flex-col gap-y-4"
        >
            <!-- Back Button -->
            <button
                @click="goBack"
                class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                :disabled="isLoading"
            >
                <PhArrowLeft class="size-4" />
                <span>Back</span>
            </button>

            <!-- Warning Icon -->
            <div class="flex justify-center">
                <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <PhWarning
                        class="size-12 text-red-600 dark:text-red-400"
                        weight="fill"
                    />
                </div>
            </div>

            <!-- Confirmation Message -->
            <div class="text-center space-y-2">
                <h3
                    class="text-lg font-semibold text-stone-900 dark:text-stone-100"
                >
                    Delete {{ selectedSocial.name }} Link?
                </h3>
                <p class="text-sm text-stone-600 dark:text-stone-400">
                    This action cannot be undone. Your
                    {{ selectedSocial.name }} link will be permanently removed.
                </p>
            </div>

            <!-- Platform Info -->
            <div
                class="flex items-center gap-3 p-4 bg-stone-50 dark:bg-dark-800 rounded-xl border border-stone-200 dark:border-dark-700"
            >
                <component :is="selectedSocial.icon" class="size-6 shrink-0" />
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-stone-900 dark:text-stone-100">
                        {{ selectedSocial.name }}
                    </p>
                    <p
                        class="text-xs text-stone-500 dark:text-stone-400 truncate"
                    >
                        {{ localUrl }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <template #footer>
            <!-- Form Footer -->
            <div
                v-if="currentStep === 'form' && selectedSocial"
                class="flex items-center justify-end gap-3 w-full"
            >
                <Button
                    variant="secondary"
                    @click="handleClose"
                    :disabled="isLoading"
                    class="flex-1"
                >
                    {{ cancelText }}
                </Button>

                <Button
                    @click="handleConfirm"
                    :disabled="!isFormValid || isLoading"
                    class="flex-1"
                >
                    <span v-if="isLoading" class="flex items-center gap-2">
                        <Spinner class="size-4 text-white" />
                        Saving...
                    </span>
                    <span v-else>{{ confirmText }}</span>
                </Button>
            </div>

            <!-- Delete Footer -->
            <div
                v-if="currentStep === 'delete'"
                class="flex items-center justify-end gap-3 w-full"
            >
                <Button
                    variant="secondary"
                    @click="goBack"
                    :disabled="isLoading"
                    class="flex-1"
                >
                    Cancel
                </Button>

                <Button
                    variant="destructive"
                    @click="confirmDelete"
                    :disabled="isLoading"
                    class="flex-1"
                >
                    <span v-if="isLoading" class="flex items-center gap-2">
                        <Spinner class="size-4 text-white" />
                        Deleting...
                    </span>
                    <span v-else>
                        <PhTrash class="size-4 inline mr-1" />
                        Delete
                    </span>
                </Button>
            </div>
        </template>
    </Modal>
</template>
