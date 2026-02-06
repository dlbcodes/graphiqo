<script setup lang="ts">
import { PhotoIcon } from "@heroicons/vue/24/outline";

interface Props {
    modelValue: boolean;
    pageId: string;
    title?: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    confirmText: "Delete",
    cancelText: "Cancel",
    isDangerous: true,
    isLoading: false,
});

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    confirm: [];
    cancel: [];
}>();

const handleClose = () => {
    if (!props.isLoading) {
        emit("update:modelValue", false);
        emit("cancel");
    }
};

const handleConfirm = () => {
    emit("confirm");
};
</script>

<template>
    <Modal
        :modelValue="modelValue"
        :title="title"
        size="lg"
        :closeOnBackdrop="!isLoading"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <!-- Body -->
        <FileUploadInput
            type="page-avatar"
            :pageId="pageId"
            :cardId="uploadedCardId || cardId"
            label="Thumbnail (Optional)"
            hint="JPG, PNG, or WebP • Max 5MB"
            v-model="thumbnailUrl"
            @uploaded="handleThumbnailUploaded"
        />

        <!-- Footer -->
        <!-- <template #footer>
            <Button variant="ghost" @click="handleClose">
                {{ cancelText }}
            </Button>

            <Button
                @click="handleConfirm"
                variant="destructive"
                :disabled="isLoading"
                class="w-fit place-self-end"
            >
                <span v-if="!isLoading">{{ confirmText }}</span>
                <span v-else>Deleting...</span>
            </Button>
        </template> -->
    </Modal>
</template>
