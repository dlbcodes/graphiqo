<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
    SOCIAL_PLATFORMS,
    validateSocialUrl,
    type SocialPlatform,
} from "~/utils/socialPlatforms";

interface Props {
    modelValue: boolean;
    platform?: string;
    url?: string;
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
    "update:modelValue": [boolean];
    confirm: [data: { platform: string; url: string }];
    cancel: [];
    delete: [];
}>();

// ----- State
const currentStep = ref<"select" | "form" | "delete">("select");
const selectedSocial = ref<SocialPlatform | null>(null);
const localUrl = ref("");
const originalUrl = ref("");

// ----- Derived
const isEditMode = computed(() => !!props.platform);

const isUrlValid = computed(() => {
    if (!localUrl.value || !selectedSocial.value) return true;
    return validateSocialUrl(selectedSocial.value.key, localUrl.value);
});

const hasChanged = computed(() => {
    if (!isEditMode.value) return true; // Always allow save in add mode
    return localUrl.value.trim() !== originalUrl.value.trim();
});

const isFormValid = computed(() => {
    return !!localUrl.value.trim() && isUrlValid.value && hasChanged.value;
});

// ----- Step transitions
const openForm = (social: SocialPlatform) => {
    selectedSocial.value = social;
    currentStep.value = "form";
};

const goBack = () => {
    if (currentStep.value === "delete") {
        currentStep.value = "form";
    } else {
        selectedSocial.value = null;
        localUrl.value = "";
        originalUrl.value = "";
        currentStep.value = "select";
    }
};

const close = () => {
    if (!props.isLoading) {
        emit("update:modelValue", false);
        emit("cancel");
    }
};

const submit = () => {
    if (!selectedSocial.value || !isFormValid.value) return;

    emit("confirm", {
        platform: selectedSocial.value.key,
        url: localUrl.value.trim(),
    });
};

const requestDelete = () => {
    currentStep.value = "delete";
};

const confirmDelete = () => {
    emit("delete");
};

// ----- Sync props → local state
watch(
    () => props.modelValue,
    (open) => {
        if (!open) return;

        localUrl.value = props.url || "";
        originalUrl.value = props.url || ""; // Store original

        if (props.platform) {
            const social = SOCIAL_PLATFORMS.find(
                (s) => s.key === props.platform
            );
            if (social) {
                selectedSocial.value = social;
                currentStep.value = "form";
            }
        } else {
            currentStep.value = "select";
        }
    },
    { immediate: true }
);
</script>

<template>
    <Modal
        :modelValue="modelValue"
        :title="title"
        size="xl"
        :closeOnBackdrop="!isLoading"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <!-- Step 1: Select -->
        <SocialSelectStep
            v-if="currentStep === 'select'"
            :platforms="SOCIAL_PLATFORMS"
            :isLoading="isLoading"
            @select="openForm"
        />

        <!-- Step 2: Form -->
        <SocialFormStep
            v-else-if="currentStep === 'form' && selectedSocial"
            :social="selectedSocial"
            v-model:url="localUrl"
            :isEditMode="isEditMode"
            :isUrlValid="isUrlValid"
            :isLoading="isLoading"
            @back="goBack"
            @submit="submit"
            @delete="requestDelete"
        />

        <!-- Step 3: Delete Confirmation -->
        <SocialDeleteStep
            v-else-if="currentStep === 'delete' && selectedSocial"
            :social="selectedSocial"
            :url="localUrl"
            :isLoading="isLoading"
            @back="goBack"
            @confirm="confirmDelete"
        />

        <!-- Footer -->
        <template #footer>
            <!-- Step 1: Select - Only Cancel -->
            <div
                v-if="currentStep === 'select'"
                class="flex justify-end w-full"
            >
                <Button
                    variant="secondary"
                    :disabled="isLoading"
                    @click="close"
                >
                    {{ cancelText }}
                </Button>
            </div>

            <!-- Step 2: Form - Cancel + Save (or Delete + Save in edit mode) -->
            <div v-else-if="currentStep === 'form'" class="flex gap-3 w-full">
                <!-- Cancel / Delete button -->
                <Button
                    v-if="isEditMode"
                    variant="destructive"
                    class="flex-1"
                    :disabled="isLoading"
                    @click="requestDelete"
                >
                    Delete
                </Button>
                <Button
                    v-else
                    variant="secondary"
                    class="flex-1"
                    :disabled="isLoading"
                    @click="close"
                >
                    {{ cancelText }}
                </Button>

                <!-- Save button -->
                <Button
                    class="flex-1"
                    :loading="isLoading"
                    :disabled="!isFormValid"
                    loadingText="Saving..."
                    @click="submit"
                >
                    {{ confirmText }}
                </Button>
            </div>

            <!-- Step 3: Delete Confirmation - Back + Confirm Delete -->
            <div v-else-if="currentStep === 'delete'" class="flex gap-3 w-full">
                <Button
                    variant="secondary"
                    class="flex-1"
                    :disabled="isLoading"
                    @click="goBack"
                >
                    Back
                </Button>

                <Button
                    variant="destructive"
                    class="flex-1"
                    :loading="isLoading"
                    loadingText="Deleting..."
                    @click="confirmDelete"
                >
                    Confirm Delete
                </Button>
            </div>
        </template>
    </Modal>
</template>
