<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";

interface Props {
    videoCard: any;
    pageData: {
        title: string;
        bio: string;
        avatarUrl: string;
        primaryColor: string;
    };
    socialLinks: any[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "progress-update": [number];
    "progress-complete": [];
}>();

// =======================
// State
// =======================
const videoRef = ref<HTMLVideoElement | null>(null);
const progress = ref(0);
const isPaused = ref(false);
let progressInterval: ReturnType<typeof setInterval> | null = null;

// =======================
// Computed
// =======================
const videoUrl = computed(() => props.videoCard?.videoUrl || null);
const thumbnailUrl = computed(
    () => props.videoCard?.thumbnailUrl || props.videoCard?.imageUrl || null,
);

const ctaLinks = computed(() =>
    [...(props.videoCard?.ctaLinks || [])]
        .filter((l) => l.isActive)
        .sort((a, b) => a.order - b.order),
);

const primaryCta = computed(() => ctaLinks.value[0] || null);
const secondaryCtas = computed(() => ctaLinks.value.slice(1));

// =======================
// Progress Logic
// =======================
const DEFAULT_DURATION = 3000;

const resetProgress = () => {
    progress.value = 0;
    if (progressInterval) clearInterval(progressInterval);
    setTimeout(() => startProgress(), 100);
};

const startProgress = () => {
    if (progressInterval) clearInterval(progressInterval);

    const video = videoRef.value;
    const duration =
        video && video.duration ? video.duration * 1000 : DEFAULT_DURATION;
    const updateInterval = 50;
    const increment = (updateInterval / duration) * 100;

    progressInterval = setInterval(() => {
        if (isPaused.value) return;
        progress.value += increment;
        emit("progress-update", progress.value);

        if (progress.value >= 100) {
            progress.value = 100;
            clearInterval(progressInterval!);
            emit("progress-complete");
        }
    }, updateInterval);
};

// =======================
// Lifecycle
// =======================
watch(() => props.videoCard, resetProgress);

onUnmounted(() => {
    if (progressInterval) clearInterval(progressInterval);
});
</script>

<template>
    <div class="absolute inset-0">
        <!-- Background Media -->
        <video
            v-if="videoUrl"
            ref="videoRef"
            :src="videoUrl"
            muted
            autoplay
            loop
            playsinline
            webkit-playsinline
            class="w-full h-full object-cover"
            @loadedmetadata="startProgress"
            @canplay="startProgress"
        />
        <img
            v-else-if="thumbnailUrl"
            :src="thumbnailUrl"
            class="w-full h-full object-cover"
            @load="startProgress"
        />
        <div
            v-else
            class="w-full h-full"
            :style="{ backgroundColor: pageData.primaryColor }"
        />

        <!-- Gradient Overlay (ONLY on video screens) -->
        <div
            class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 pointer-events-none"
        />

        <!-- Content Overlay -->
        <div
            class="absolute inset-0 z-10 flex flex-col justify-between h-full pt-safe px-4 pb-safe pointer-events-none"
        >
            <VideoHeader :page-data="pageData" />

            <CtaButtons
                :primary-cta="primaryCta"
                :secondary-ctas="secondaryCtas"
                :primary-color="pageData.primaryColor"
                :social-links="socialLinks"
            />
        </div>
    </div>
</template>

<style scoped>
.pt-safe {
    padding-top: max(1rem, env(safe-area-inset-top));
}
.pb-safe {
    padding-bottom: max(2.5rem, env(safe-area-inset-bottom));
}
</style>
