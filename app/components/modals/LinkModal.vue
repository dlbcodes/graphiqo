<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface Props {
    modelValue: boolean;
    title?: string;
    label?: string;
    url?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: "Link",
    label: "",
    url: "",
    confirmText: "Save",
    cancelText: "Cancel",
    isLoading: false,
});

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    confirm: [data: { label: string; url: string }];
    cancel: [];
}>();

// Local state
const localLabel = ref("");
const localUrl = ref("");

// Computed
const isFormValid = computed(() => {
    return (
        localLabel.value.trim().length > 0 && localUrl.value.trim().length > 0
    );
});

const isUrlValid = computed(() => {
    if (!localUrl.value.trim()) return true; // Don't show error for empty field

    try {
        new URL(localUrl.value);
        return true;
    } catch {
        return false;
    }
});

// Sync props to local state when modal opens
watch(
    () => props.modelValue,
    (isOpen) => {
        if (isOpen) {
            localLabel.value = props.label;
            localUrl.value = props.url;
        }
    },
    { immediate: true }
);

// Also watch individual props in case they change while modal is open
watch(
    () => props.label,
    (newVal) => {
        if (props.modelValue) {
            localLabel.value = newVal;
        }
    }
);

watch(
    () => props.url,
    (newVal) => {
        if (props.modelValue) {
            localUrl.value = newVal;
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
    if (!isFormValid.value || !isUrlValid.value) {
        return;
    }

    emit("confirm", {
        label: localLabel.value.trim(),
        url: localUrl.value.trim(),
    });
};

const resetForm = () => {
    // Small delay to avoid jarring UI when modal closes
    setTimeout(() => {
        localLabel.value = "";
        localUrl.value = "";
    }, 150);
};

// Handle Enter key in inputs
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (isFormValid.value && isUrlValid.value && !props.isLoading) {
            handleConfirm();
        }
    }
};
</script>

<template>
    <Modal
        :modelValue="modelValue"
        :title="title"
        size="xl"
        :closeOnBackdrop="!isLoading"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <form @submit.prevent="handleConfirm" class="flex flex-col gap-4">
            <!-- Label Field -->
            <Field
                id="page-link-label"
                label="Label"
                required
                placeholder="e.g., My Website, Portfolio, GitHub"
            >
                <Input
                    id="page-link-label"
                    v-model="localLabel"
                    type="text"
                    :disabled="isLoading"
                    autocomplete="off"
                    maxlength="100"
                    @keydown="handleKeydown"
                />
                <template #hint>
                    <span class="text-xs text-stone-500">
                        {{ localLabel.length }}/100 characters
                    </span>
                </template>
            </Field>

            <!-- URL Field -->
            <Field
                id="page-link-url"
                label="URL"
                required
                placeholder="https://example.com"
                :error="
                    localUrl.trim() && !isUrlValid
                        ? 'Please enter a valid URL'
                        : undefined
                "
            >
                <Input
                    id="page-link-url"
                    v-model="localUrl"
                    type="url"
                    :disabled="isLoading"
                    autocomplete="url"
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
                    class="flex-1"
                    :disabled="isLoading"
                    @click="handleClose"
                >
                    {{ cancelText }}
                </Button>

                <Button
                    :disabled="!isFormValid || !isUrlValid || isLoading"
                    :loading="isLoading"
                    loadingText="Saving..."
                    @click="handleConfirm"
                    class="flex-1"
                >
                    {{ confirmText }}
                </Button>
            </div>
        </template>
    </Modal>
</template>
