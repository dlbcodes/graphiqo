<script setup lang="ts">
import {
    PlusIcon,
    EllipsisVerticalIcon,
    PhotoIcon,
} from "@heroicons/vue/24/outline";
import { PhDotsSixVertical, PhImage } from "@phosphor-icons/vue";
import type { VideoCard } from "@/types/page";
import { EyeIcon, CursorIcon } from "~/assets/images/icons";

const props = defineProps<{
    pageId: string;
}>();

const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);

// ----- Modal state using useModal composable
const mediaModal = useModal<VideoCard>();
const isSavingMedia = ref(false);

// ----- Source of truth
const media = computed(() => {
    if (!currentPage.value || currentPage.value.id !== props.pageId) {
        return [];
    }
    return [...(currentPage.value.videoCards || [])].sort(
        (a, b) => a.order - b.order
    );
});

// ----- Sortable composable
const {
    container,
    items: sortableMedia,
    isSorting,
    hasUnsavedOrder,
} = useSortableOrder(media, async (orders) => {
    await pageStore.reorderVideoCards(props.pageId, orders);
});

// ----- Modal computed properties
const modalTitle = computed(() =>
    mediaModal.data.value ? "Edit Media" : "Upload Media"
);

// const editingCardId = computed(() => mediaModal.data.value?.id || undefined);
// const editingVideoUrl = computed(() => mediaModal.data.value?.videoUrl || "");
// const editingImageUrl = computed(() => mediaModal.data.value?.imageUrl || "");
// const editingThumbnailUrl = computed(
//     () => mediaModal.data.value?.thumbnailUrl || ""
// );
// const editingCtaLinks = computed(() => mediaModal.data.value?.ctaLinks || []);
// const editingIsActive = computed(() => mediaModal.data.value?.isActive || true);
// const editingIsNsfw = computed(() => mediaModal.data.value?.isNsfw || true);
const isEmpty = computed(() => sortableMedia.value.length === 0);

// ----- Modal handlers using the composable
const openAddModal = () => {
    mediaModal.open(); // Open without data = add mode
};

const openEditModal = (mediaCard: VideoCard) => {
    mediaModal.open(mediaCard); // Open with data = edit mode
};

const handleModalConfirm = async (cardId: string) => {
    console.log("Media saved:", cardId);

    // Refresh page data to show the new/updated card
    await pageStore.fetchPage(props.pageId);

    mediaModal.close(); // Clean close with data reset
};

const handleModalCancel = () => {
    mediaModal.close();
};
</script>

<template>
    <div class="flex flex-col gap-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <Header
                title="Media Gallery"
                subtitle="Upload and manage your video content"
                size="sm"
            />
            <button
                v-if="!isEmpty"
                class="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isSavingMedia"
                @click="openAddModal"
            >
                Add Media
            </button>
        </div>

        <!-- Empty State -->
        <EmptyMedia
            v-if="isEmpty"
            :disabled="isSavingMedia"
            @create="openAddModal"
        />

        <!-- Media Grid -->
        <div
            v-else
            ref="container"
            class="relative flex overflow-x-auto pb-2 gap-x-4 snap-x snap-mandatory scroll-px-6 px-0 no-scrollbar"
        >
            <!-- Media Cards -->
            <div
                v-for="mediaCard in sortableMedia"
                :key="mediaCard.id"
                @click="openEditModal(mediaCard)"
                class="relative group flex flex-col w-54 shrink-0 rounded-2xl aspect-9/16 bg-stone-100 border border-stone-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
                <!-- Drag Handle -->
                <div
                    class="absolute z-10 top-2 right-2 drag-handle cursor-grab active:cursor-grabbing p-1 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    @click.stop
                >
                    <PhDotsSixVertical class="size-5 text-white" />
                </div>
                <!-- Video Preview -->
                <div class="relative flex-1 w-full h-full overflow-hidden">
                    <video
                        v-if="mediaCard.videoUrl"
                        muted
                        loop
                        playsinline
                        :src="mediaCard.videoUrl"
                        class="absolute inset-0 w-full h-full object-cover"
                        @mouseenter="(e) => (e.target as HTMLVideoElement).play()"
                        @mouseleave="(e) => (e.target as HTMLVideoElement).pause()"
                    />
                    <div
                        v-else
                        class="absolute inset-0 flex items-center justify-center bg-stone-200"
                    >
                        <PhotoIcon class="size-12 text-stone-400" />
                    </div>

                    <!-- Hidden badge -->
                    <div
                        v-if="!mediaCard.isActive"
                        class="absolute top-2 left-2 px-2 py-1 bg-stone-800 text-white text-xs font-medium rounded-full"
                    >
                        Hidden
                    </div>
                </div>

                <!-- Stats -->
                <div
                    class="grid grid-cols-2 gap-x-2 py-2 px-3 bg-white border-t border-stone-200"
                >
                    <div
                        class="flex items-center gap-x-1 text-xs text-stone-600"
                    >
                        <img :src="EyeIcon" class="size-5 shrink-0" />
                        {{ mediaCard.viewCount || 0 }} views
                    </div>
                    <div
                        class="flex items-center gap-x-1 text-xs text-stone-600"
                    >
                        <img :src="CursorIcon" class="size-5 shrink-0" />
                        {{ mediaCard.clickCount || 0 }} clicks
                    </div>
                </div>
            </div>

            <!-- Add Media Card -->
            <AddMedia @create="openAddModal" />
        </div>

        <SortingIndicator
            :hasUnsavedOrder="hasUnsavedOrder"
            :isSorting="isSorting"
        />
    </div>

    <!-- Media Upload Modal -->
    <MediaModal
        v-model="mediaModal.isOpen.value"
        :pageId="pageId"
        :mediaCard="mediaModal.data.value"
        :title="modalTitle"
        @confirm="handleModalConfirm"
        @cancel="handleModalCancel"
    />
</template>
