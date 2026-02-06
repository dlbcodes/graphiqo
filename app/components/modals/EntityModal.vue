<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface Props {
    modelValue: boolean;
    modalTitle?: string;
    title?: string;
    bio?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modalTitle: "Link",
    title: "",
    bio: "",
    confirmText: "Save",
    cancelText: "Cancel",
    isLoading: false,
});

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    confirm: [data: { title: string; bio: string }];
    cancel: [];
}>();

// Local state
const localTitle = ref("");
const localBio = ref("");

// Computed
const isFormValid = computed(() => {
    return (
        localTitle.value.trim().length > 0 && localTitle.value.trim().length > 0
    );
});

// Sync props to local state when modal opens
watch(
    () => props.modelValue,
    (isOpen) => {
        if (isOpen) {
            localTitle.value = props.title;
            localBio.value = props.bio;
        }
    },
    { immediate: true }
);

// Also watch individual props in case they change while modal is open
watch(
    () => props.title,
    (newVal) => {
        if (props.modelValue) {
            localTitle.value = newVal;
        }
    }
);

watch(
    () => props.bio,
    (newVal) => {
        if (props.modelValue) {
            localBio.value = newVal;
        }
    }
);

// Handlers
const handleClose = () => {
    if (!props.isLoading) {
        emit("update:modelValue", false);
        emit("cancel");
        resetForm();
    }
};

const handleConfirm = () => {
    if (!isFormValid.value) {
        return;
    }

    emit("confirm", {
        title: localTitle.value.trim(),
        bio: localBio.value.trim(),
    });
};

const resetForm = () => {
    // Small delay to avoid jarring UI when modal closes
    setTimeout(() => {
        localTitle.value = "";
        localBio.value = "";
    }, 150);
};

// Handle Enter key in inputs
const handleKeydown = (event: KeyboardEvent) => {
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
        <form @submit.prevent="handleConfirm" class="flex flex-col gap-4">
            <!-- Titloe Field -->
            <Field id="page-title" label="Title" required>
                <Input
                    v-model="localTitle"
                    type="text"
                    :disabled="isLoading"
                    autocomplete="off"
                    maxlength="100"
                    @keydown="handleKeydown"
                />
                <template #hint>
                    <span class="text-xs text-stone-500">
                        {{ localTitle.length }}/100 characters
                    </span>
                </template>
            </Field>

            <!-- Bio Field -->
            <Field id="page-bio" label="Bio">
                <Input
                    id="page-link-url"
                    v-model="localBio"
                    type="text"
                    :disabled="isLoading"
                    @keydown="handleKeydown"
                />
                <template #hint>
                    <span class="text-xs text-stone-500">
                        Must start with http:// or https://
                    </span>
                </template>
            </Field>
        </form>

        <!-- Footer -->
        <template #footer>
            <div class="flex items-center justify-end gap-3 w-full">
                <Button
                    variant="secondary"
                    :disabled="isLoading"
                    class="flex-1"
                    @click="handleClose"
                >
                    {{ cancelText }}
                </Button>

                <Button
                    :disabled="!isFormValid || isLoading"
                    class="flex-1"
                    @click="handleConfirm"
                >
                    <span v-if="isLoading" class="flex items-center gap-2">
                        <span
                            class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                        ></span>
                        Saving...
                    </span>
                    <span v-else>{{ confirmText }}</span>
                </Button>
            </div>
        </template>
    </Modal>
</template>
