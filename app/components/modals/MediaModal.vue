<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
    PhotoIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ArrowPathIcon, // Added for replace icon
} from "@heroicons/vue/24/outline";
import type { UploadResult } from "~/composables/useFileUpload";
import type { VideoCard } from "@/types/page";

// 1. REFACTORED PROPS
// We now accept the full `mediaCard` object instead of individual fields
interface Props {
    modelValue: boolean;
    pageId: string;
    mediaCard?: VideoCard; // Optional: Undefined = Add Mode, Object = Edit Mode
    title?: string;
    confirmText?: string;
    cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: "Upload Media",
    confirmText: "Save",
    cancelText: "Cancel",
    mediaCard: undefined,
});

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    confirm: [cardId: string];
    cancel: [];
}>();

const pageStore = usePageStore();

// --- STATE ---
const step = ref<1 | 2>(1);
const isUploading = ref(false);
const isSaving = ref(false);

// Local Form State
const uploadedCardId = ref<string | null>(null);
const videoUrl = ref<string>("");

// Settings State
const isActive = ref(true);
const isNsfw = ref(false);

// CTA State
const ctaLabel = ref("");
const ctaUrl = ref("");
const ctaLinkId = ref<string | null>(null);

// --- COMPUTED ---
const isEditMode = computed(() => !!props.mediaCard);

const modalTitle = computed(() => {
    if (step.value === 1) return props.title;
    return isEditMode.value ? "Edit Media Details" : "Configure New Media";
});

const canProceed = computed(() => {
    return uploadedCardId.value !== null && videoUrl.value !== "";
});

// Calculate if user made changes to enable/disable Save button
const hasChanges = computed(() => {
    // If adding new media, always true
    if (!isEditMode.value) return true;

    // Compare local state to prop object
    const original = props.mediaCard!;
    const originalCta = original.ctaLinks?.[0];

    const settingsChanged =
        isActive.value !== original.isActive ||
        isNsfw.value !== original.isNsfw;

    const ctaChanged =
        ctaLabel.value !== (originalCta?.title || "") ||
        ctaUrl.value !== (originalCta?.url || "");

    // If video URL changed (via replace feature)
    const videoChanged = videoUrl.value !== original.videoUrl;

    return settingsChanged || ctaChanged || videoChanged;
});

// --- WATCHER ---
// Populates form when modal opens
watch(
    () => props.modelValue,
    (isOpen) => {
        if (isOpen) {
            if (props.mediaCard) {
                // --- EDIT MODE ---
                const card = props.mediaCard;

                step.value = 2; // Jump straight to settings
                uploadedCardId.value = card.id;
                videoUrl.value = card.videoUrl || "";
                isActive.value = card.isActive ?? true;
                isNsfw.value = card.isNsfw ?? false;

                // CTA (Take the first one if it exists)
                const cta = card.ctaLinks?.[0];
                if (cta) {
                    ctaLabel.value = cta.title;
                    ctaUrl.value = cta.url;
                    ctaLinkId.value = cta.id;
                } else {
                    ctaLabel.value = "";
                    ctaUrl.value = "";
                    ctaLinkId.value = null;
                }
            } else {
                // --- ADD MODE ---
                resetLocalState();
                step.value = 1;
            }
        }
    }
);

// --- HANDLERS ---

const resetLocalState = () => {
    uploadedCardId.value = null;
    videoUrl.value = "";
    ctaLabel.value = "";
    ctaUrl.value = "";
    ctaLinkId.value = null;
    isActive.value = true;
    isNsfw.value = false;
};

const handleClose = () => {
    if (!isUploading.value && !isSaving.value) {
        emit("update:modelValue", false);
        emit("cancel");
        // Delay reset slightly for animation
        setTimeout(() => {
            step.value = 1;
            resetLocalState();
        }, 200);
    }
};

const handleVideoUploaded = (result: UploadResult) => {
    videoUrl.value = result.publicUrl;
    // If we are replacing an existing card's video, we don't need a new ID
    if (result.cardId && !uploadedCardId.value) {
        uploadedCardId.value = result.cardId;
    }

    // Move to step 2 after upload
    step.value = 2;
};

const handleCardCreated = (cardId: string) => {
    // Only set this if we aren't already editing an existing card
    if (!uploadedCardId.value) {
        uploadedCardId.value = cardId;
    }
};

const handleReplaceVideo = () => {
    // Allows user to go back to step 1 to upload a new file
    // while keeping the current ID (so we update the file, not create new)
    step.value = 1;
};

const goBack = () => {
    // Only allow going back if we are in "Add Mode"
    // OR if we are in "Edit Mode" but hit "Replace Video"
    step.value = 1;
};

// --- SAVE LOGIC ---
const handleConfirm = async () => {
    if (!uploadedCardId.value) return;

    isSaving.value = true;

    try {
        // 1. Update Basic Settings
        const updateSettings = pageStore.updateVideoCard(
            props.pageId,
            uploadedCardId.value,
            {
                isActive: isActive.value,
                isNsfw: isNsfw.value,
            }
        );

        // 2. Handle CTA Logic
        let updateCta = Promise.resolve();
        const hasCtaInput = ctaLabel.value.trim() && ctaUrl.value.trim();

        if (hasCtaInput) {
            const payload = {
                title: ctaLabel.value.trim(),
                url: ctaUrl.value.trim(),
                ...(ctaLinkId.value ? {} : { order: 0 }),
            };

            if (ctaLinkId.value) {
                pageStore.updateCtaLink(
                    props.pageId,
                    uploadedCardId.value,
                    ctaLinkId.value,
                    payload
                );
            } else {
                // Create New CTA
                pageStore.createCtaLink(
                    props.pageId,
                    uploadedCardId.value,
                    payload
                );
            }
        } else if (ctaLinkId.value) {
            // Input empty + ID exists = Delete CTA
            pageStore.deleteCtaLink(
                props.pageId,
                uploadedCardId.value,
                ctaLinkId.value
            );
        }

        // Wait for all operations
        await Promise.all([updateSettings, updateCta]);

        // 3. Finish
        await pageStore.fetchPage(props.pageId);
        emit("confirm", uploadedCardId.value);
        emit("update:modelValue", false);
    } catch (error) {
        console.error("Failed to save media:", error);
    } finally {
        isSaving.value = false;
    }
};
</script>

<template>
    <Modal
        :modelValue="modelValue"
        :title="modalTitle"
        size="5xl"
        :closeOnBackdrop="!isUploading && !isSaving"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <div v-if="step === 1" class="flex flex-col gap-4">
            <div class="text-center">
                <p class="text-sm text-stone-600 mb-4">
                    {{
                        isEditMode
                            ? "Upload a new file to replace the current video"
                            : "Upload your video file to create a new media card"
                    }}
                </p>
            </div>

            <FileUploadInput
                type="page-video"
                :pageId="pageId"
                :cardId="uploadedCardId || undefined"
                label="Video File"
                hint="MP4, WebM, or OGG • Max 100MB"
                v-model="videoUrl"
                @uploaded="handleVideoUploaded"
                @cardCreated="handleCardCreated"
            />

            <div v-if="isEditMode" class="flex justify-center mt-2">
                <button
                    @click="step = 2"
                    class="text-sm text-stone-500 hover:text-stone-800 hover:underline"
                >
                    Cancel replace and go back
                </button>
            </div>
        </div>

        <div v-else-if="step === 2" class="grid grid-cols-2 gap-6">
            <div class="flex flex-col gap-6">
                <button
                    v-if="!isEditMode && !uploadedCardId"
                    @click="goBack"
                    class="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors self-start"
                >
                    <ArrowLeftIcon class="size-4" />
                    <span>Back to upload</span>
                </button>

                <div class="flex flex-col gap-2">
                    <Header title="Video Source" subtitle="cenas" size="sm" />
                    <div
                        class="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between"
                    >
                        <div class="flex items-center gap-2 overflow-hidden">
                            <CheckCircleIcon
                                class="size-5 text-green-600 shrink-0"
                            />
                            <span class="text-xs text-stone-600 truncate"
                                >File Uploaded</span
                            >
                        </div>
                        <Button
                            size="xs"
                            variant="outline"
                            @click="handleReplaceVideo"
                        >
                            <ArrowPathIcon class="size-3 mr-1" />
                            Replace
                        </Button>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <Header
                        title="Call-to-Action Button"
                        subtitle="Add a single action button (optional)"
                        size="sm"
                    />

                    <div
                        class="flex flex-col gap-3 p-4 bg-stone-50 rounded-lg border border-stone-200"
                    >
                        <Field id="cta-label" label="Button Label">
                            <Input
                                type="text"
                                v-model="ctaLabel"
                                placeholder="e.g., Watch on YouTube"
                                :disabled="isSaving"
                            />
                        </Field>

                        <Field id="cta-url" label="URL">
                            <Input
                                type="url"
                                v-model="ctaUrl"
                                placeholder="https://example.com"
                                :disabled="isSaving"
                            />
                        </Field>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <Header title="Settings" subtitle="Cenas" size="sm" />

                    <div
                        class="flex items-start gap-3 p-4 bg-stone-50 rounded-lg border border-stone-200"
                    >
                        <div class="flex-1">
                            <p class="font-medium text-stone-900 mb-1">
                                Published
                            </p>
                            <p class="text-sm text-stone-600">
                                Visible to visitors
                            </p>
                        </div>
                        <Switch v-model="isActive" />
                    </div>

                    <div
                        class="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200"
                    >
                        <div class="flex-1">
                            <p class="font-medium text-stone-900 mb-1">
                                Mark as NSFW
                            </p>
                            <p class="text-sm text-stone-600">
                                Shows warning before viewing
                            </p>
                        </div>
                        <Switch v-model="isNsfw" />
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-4 items-center justify-center">
                <label class="text-sm font-medium text-stone-700 self-start"
                    >Preview</label
                >

                <div
                    class="relative w-[70%] aspect-9/16 rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-100 shadow-lg"
                >
                    <video
                        v-if="videoUrl"
                        :src="videoUrl"
                        class="w-full h-full object-cover"
                        controls
                        loop
                    />
                    <div
                        v-else
                        class="flex flex-col items-center justify-center h-full text-stone-400"
                    >
                        <PhotoIcon class="size-12 mb-2" />
                        <p class="text-sm">No video uploaded</p>
                    </div>

                    <div
                        v-if="!isActive"
                        class="absolute top-2 left-2 px-2 py-1 bg-stone-800 text-white text-xs font-medium rounded-full"
                    >
                        Hidden
                    </div>
                    <div
                        v-if="isNsfw"
                        class="absolute top-2 right-2 px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded-full"
                    >
                        NSFW
                    </div>

                    <div
                        v-if="ctaLabel.trim() && ctaUrl.trim()"
                        class="absolute bottom-4 left-4 right-4"
                    >
                        <div
                            class="px-4 py-2 bg-white text-stone-900 rounded-lg text-center font-medium shadow-lg truncate"
                        >
                            {{ ctaLabel }}
                        </div>
                    </div>
                </div>

                <p class="text-xs text-stone-500 text-center">
                    Live preview of your media card
                </p>
            </div>
        </div>

        <template #footer>
            <div class="flex items-center justify-between w-full">
                <div class="text-xs text-stone-500">
                    <span v-if="isEditMode && !hasChanges"
                        >No changes to save</span
                    >
                </div>

                <div class="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        @click="handleClose"
                        :disabled="isUploading || isSaving"
                    >
                        {{ cancelText }}
                    </Button>

                    <Button
                        v-if="step === 2"
                        @click="handleConfirm"
                        :disabled="
                            !canProceed ||
                            isUploading ||
                            isSaving ||
                            (isEditMode && !hasChanges)
                        "
                    >
                        <Spinner v-if="isSaving" class="size-4 mr-2" />
                        {{ isSaving ? "Saving..." : confirmText }}
                    </Button>
                </div>
            </div>
        </template>
    </Modal>
</template>
