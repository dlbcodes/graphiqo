<script setup lang="ts">
import { PhotoIcon, VideoCameraIcon } from "@heroicons/vue/24/outline";
import {
    useFileUpload,
    type FileUploadType,
    type UploadResult,
} from "~/composables/useFileUpload";

const props = defineProps<{
    type: FileUploadType;
    pageId?: string;
    cardId?: string;
    linkId?: string;
    accept?: string;
    label?: string;
    hint?: string;
    modelValue?: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string];
    uploaded: [result: UploadResult];
    cardCreated: [cardId: string];
}>();

const { uploading, uploadProgress, uploadFile } = useFileUpload();
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(props.modelValue || null);
const error = ref<string | null>(null);
const isDragging = ref(false);

// Get accept attribute based on type
const acceptAttr = computed(() => {
    if (props.accept) return props.accept;

    switch (props.type) {
        case "avatar":
        case "cover":
        case "page-thumbnail":
        case "page-image":
        case "page-link-thumbnail":
            return "image/*";
        case "page-video":
            return "video/*";
        default:
            return "*";
    }
});

const isVideo = computed(() => props.type === "page-video");

const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    await processFile(file);

    // Clear input
    if (input) input.value = "";
};

const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    await processFile(file);
};

const processFile = async (file: File) => {
    error.value = null;

    // Create preview for images
    if (file.type.startsWith("image/")) {
        previewUrl.value = URL.createObjectURL(file);
    }

    try {
        const result = await uploadFile(file, props.type, {
            pageId: props.pageId,
            cardId: props.cardId,
            linkId: props.linkId,
        });

        emit("update:modelValue", result.publicUrl);
        emit("uploaded", result);

        // Emit cardCreated event if a new card was created
        if (result.created && result.cardId) {
            console.log("✨ New VideoCard created:", result.cardId);
            emit("cardCreated", result.cardId);
        }

        previewUrl.value = result.publicUrl;

        // Show success message if card was created
        if (result.created) {
            console.log("🎉 File uploaded and VideoCard created successfully!");
        }
    } catch (err) {
        console.error("Upload error:", err);
        error.value = err instanceof Error ? err.message : "Upload failed";
        previewUrl.value = props.modelValue || null;
    }
};

const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const triggerFileInput = () => {
    fileInput.value?.click();
};

const removeFile = () => {
    previewUrl.value = null;
    emit("update:modelValue", "");
};

watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue) previewUrl.value = newValue;
    }
);
</script>

<template>
    <div class="space-y-3">
        <!-- Label -->
        <label
            v-if="label"
            class="block text-sm font-medium text-stone-700 dark:text-stone-300"
        >
            {{ label }}
        </label>

        <!-- Hidden File Input -->
        <input
            ref="fileInput"
            type="file"
            :accept="acceptAttr"
            @change="handleFileSelect"
            class="hidden"
        />

        <!-- Preview State -->
        <div
            v-if="previewUrl && !uploading"
            class="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
        >
            <!-- Image Preview -->
            <img
                v-if="!isVideo"
                :src="previewUrl"
                :alt="label || 'Preview'"
                class="w-full h-full object-cover"
            />

            <!-- Video Preview -->
            <video
                v-else
                :src="previewUrl"
                class="w-full h-full object-cover"
                controls
            />

            <!-- Remove Button -->
            <button
                @click="removeFile"
                type="button"
                class="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove file"
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            <!-- Change File Overlay (on hover) -->
            <div
                @click="triggerFileInput"
                class="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
            >
                <div class="text-white text-center">
                    <PhotoIcon v-if="!isVideo" class="size-8 mx-auto mb-2" />
                    <VideoCameraIcon v-else class="size-8 mx-auto mb-2" />
                    <p class="font-medium">Change File</p>
                </div>
            </div>
        </div>

        <!-- Upload State -->
        <div
            v-else-if="uploading"
            class="w-full h-48 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 flex flex-col items-center justify-center p-6"
        >
            <!-- Spinner -->
            <Spinner class="size-12" />

            <!-- Progress Text -->
            <p
                class="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
            >
                Uploading...
            </p>

            <!-- Progress Bar -->
            <div
                class="w-full max-w-xs bg-stone-200 dark:bg-stone-700 rounded-full h-2 overflow-hidden"
            >
                <div
                    class="bg-stone-900 dark:bg-stone-100 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${uploadProgress}%` }"
                />
            </div>

            <!-- Percentage -->
            <p class="text-xs text-stone-500 dark:text-stone-400 mt-2">
                {{ uploadProgress }}%
            </p>
        </div>

        <!-- Upload Area (Empty State) -->
        <div
            v-else
            @click="triggerFileInput"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            class="flex justify-center items-center w-full h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer"
            :class="[
                isDragging
                    ? 'border-stone-400 bg-stone-100 dark:border-stone-500 dark:bg-stone-700'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700',
            ]"
        >
            <div
                class="flex flex-col gap-y-2 justify-center items-center text-center text-sm text-stone-500 dark:text-stone-400"
            >
                <PhotoIcon v-if="!isVideo" class="size-8 shrink-0" />
                <VideoCameraIcon v-else class="size-8 shrink-0" />
                <p class="font-medium">
                    Select a file to upload, <br />
                    or drag and drop file
                </p>
                <p
                    v-if="hint"
                    class="text-xs text-stone-400 dark:text-stone-500"
                >
                    {{ hint }}
                </p>
            </div>
        </div>

        <!-- Info message for page uploads -->
        <p
            v-if="type.startsWith('page-video') && !cardId && !uploading"
            class="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-x-1"
        >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                />
            </svg>
            A new video card will be created automatically
        </p>

        <!-- Error Message -->
        <p
            v-if="error"
            class="text-sm text-red-600 dark:text-red-400 flex items-center gap-x-1"
        >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                />
            </svg>
            {{ error }}
        </p>
    </div>
</template>
