<script setup lang="ts">
import { useSwipe } from "@vueuse/core";

interface Props {
    videoCards: any[];
    currentIndex: number;
    pageData: {
        title: string;
        bio: string;
        avatarUrl: string;
        primaryColor: string;
    };
    socialLinks: any[];
    totalItems: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "update:index": [number];
}>();

// =======================
// State
// =======================
const containerRef = ref<HTMLElement | null>(null);
const progress = ref(0);

// =======================
// Computed
// =======================
const currentVideoCard = computed(
    () => props.videoCards[props.currentIndex] || null,
);

const canGoPrevious = computed(() => props.currentIndex > 0);
const canGoNext = computed(() => props.currentIndex < props.videoCards.length);

// =======================
// Navigation
// =======================
const goToPrevious = () => {
    if (canGoPrevious.value) {
        emit("update:index", props.currentIndex - 1);
    }
};

const goToNext = () => {
    if (canGoNext.value) {
        emit("update:index", props.currentIndex + 1);
    }
};

const handleTap = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) {
        goToPrevious();
    } else {
        goToNext();
    }
};

// Swipe gesture support
const { direction } = useSwipe(containerRef, {
    threshold: 50,
    onSwipe() {
        if (direction.value === "left") goToNext();
        else if (direction.value === "right") goToPrevious();
    },
});

// =======================
// Progress Management
// =======================
const handleProgressUpdate = (newProgress: number) => {
    progress.value = newProgress;
};

const handleProgressComplete = () => {
    goToNext();
};

const handleProgressBarClick = (index: number) => {
    emit("update:index", index);
};

const getCardProgress = (index: number) => {
    if (index < props.currentIndex) return 100;
    if (index > props.currentIndex) return 0;
    return progress.value;
};
</script>

<template>
    <div
        ref="containerRef"
        class="relative w-full h-full cursor-pointer select-none"
        @click="handleTap"
    >
        <!-- Progress Bar -->
        <ProgressBar
            :total-items="totalItems"
            :current-index="currentIndex"
            :get-progress="getCardProgress"
            @click-bar="handleProgressBarClick"
        />

        <!-- Video Card -->
        <VideoCard
            :video-card="currentVideoCard"
            :page-data="pageData"
            :social-links="socialLinks"
            @progress-update="handleProgressUpdate"
            @progress-complete="handleProgressComplete"
        />

        <!-- Navigation Buttons (Desktop) -->
        <NavigationButtons
            :can-go-previous="canGoPrevious"
            :can-go-next="canGoNext"
            @previous="goToPrevious"
            @next="goToNext"
        />
    </div>
</template>
