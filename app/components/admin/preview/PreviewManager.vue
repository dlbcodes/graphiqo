<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { buttonVariants } from "~/variants/ButtonVariants";
import { usePageStore } from "~/stores/pageStore";
import { storeToRefs } from "pinia";
import { getSocialPlatformIcon } from "~/utils/socialPlatforms";

const props = defineProps<{
    pageId: string;
    interactive?: boolean; // Allow clicks if true
}>();

const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);

// Current video card index
const currentCardIndex = ref(0);

// Computed values from current page
const title = computed(() => currentPage.value?.title || "Untitled");
const bio = computed(() => currentPage.value?.bio || "");
const avatarUrl = computed(() => currentPage.value?.avatarUrl || "");
const slug = computed(() => currentPage.value?.slug || "");
const theme = computed(() => currentPage.value?.theme || "dark");
const primaryColor = computed(
    () => currentPage.value?.primaryColor || "#4f39f6"
);

// Video cards - sorted by order
const videoCards = computed(() => {
    return [...(currentPage.value?.videoCards || [])]
        .filter((card) => card.isActive)
        .sort((a, b) => a.order - b.order);
});

// Current video card
const currentVideoCard = computed(() => {
    return videoCards.value[currentCardIndex.value] || null;
});

// Current card's CTA links - sorted by order
const currentCtaLinks = computed(() => {
    if (!currentVideoCard.value) return [];
    return [...(currentVideoCard.value.ctaLinks || [])]
        .filter((link) => link.isActive)
        .sort((a, b) => a.order - b.order);
});

// Primary CTA (first one or marked as primary)
const primaryCta = computed(() => {
    return currentCtaLinks.value[0] || null;
});

// Secondary CTAs (all others)
const secondaryCtas = computed(() => {
    return currentCtaLinks.value.slice(1);
});

// Social links - sorted and active only
const socialLinks = computed(() => {
    return [...(currentPage.value?.socialLinks || [])]
        .filter((link) => link.isActive)
        .sort((a, b) => a.order - b.order);
});

// Page links - sorted
const pageLinks = computed(() => {
    return [...(currentPage.value?.pageLinks || [])]
        .filter((link) => link.isActive)
        .sort((a, b) => a.order - b.order);
});

// Navigation
const canGoPrevious = computed(() => currentCardIndex.value > 0);
const canGoNext = computed(
    () => currentCardIndex.value < videoCards.value.length - 1
);

const goToPrevious = () => {
    if (canGoPrevious.value) {
        currentCardIndex.value--;
    }
};

const goToNext = () => {
    if (canGoNext.value) {
        currentCardIndex.value++;
    }
};

// Reset index when video cards change
watch(
    () => videoCards.value.length,
    () => {
        if (currentCardIndex.value >= videoCards.value.length) {
            currentCardIndex.value = Math.max(0, videoCards.value.length - 1);
        }
    }
);

// Video URL construction (assumes CloudFront distribution)
const getVideoUrl = (videoFile: string | null) => {
    if (!videoFile) return null;
    // If it's already a full URL, return it
    if (videoFile.startsWith("http")) return videoFile;
    // Otherwise, construct CloudFront URL
    return `https://d1pq66zy7u8eg6.cloudfront.net/${videoFile}`;
};

const currentVideoUrl = computed(() => {
    return getVideoUrl(currentVideoCard.value?.videoUrl);
});

// Image/Thumbnail URL
const getThumbnailUrl = (
    imageFile: string | null,
    thumbnailFile: string | null
) => {
    const file = thumbnailFile || imageFile;
    if (!file) return null;
    if (file.startsWith("http")) return file;
    return `https://d1pq66zy7u8eg6.cloudfront.net/${file}`;
};

const currentThumbnailUrl = computed(() => {
    return getThumbnailUrl(
        currentVideoCard.value?.imageFile,
        currentVideoCard.value?.thumbnailFile
    );
});

// Check if page has any content
const hasVideoCards = computed(() => videoCards.value.length > 0);
const hasSocialLinks = computed(() => socialLinks.value.length > 0);
const hasPageLinks = computed(() => pageLinks.value.length > 0);
const hasAnyContent = computed(
    () => hasVideoCards.value || hasSocialLinks.value || hasPageLinks.value
);

// Theme classes
const isDarkTheme = computed(() => theme.value === "dark");
const textColor = computed(() =>
    isDarkTheme.value ? "text-white" : "text-stone-900"
);
const bgOverlay = computed(() =>
    isDarkTheme.value
        ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        : "bg-gradient-to-t from-white/90 via-white/30 to-transparent"
);

// Handle link click
const handleLinkClick = (
    url: string,
    type: "cta" | "social" | "page",
    id: string
) => {
    if (props.interactive) {
        // You can add analytics tracking here
        console.log(`Clicked ${type} link:`, id, url);
        window.open(url, "_blank", "noopener,noreferrer");
    }
};
</script>

<template>
    <div
        class="w-[380px] aspect-9/16 rounded-[2.5rem] border border-stone-200 shadow-lg overflow-hidden relative bg-stone-900"
    >
        <!-- Background Video/Image -->
        <div class="absolute inset-0">
            <video
                v-if="currentVideoUrl"
                :key="currentVideoUrl"
                muted
                loop
                playsinline
                :poster="currentThumbnailUrl || undefined"
                :src="currentVideoUrl"
                class="w-full h-full object-cover"
            ></video>
            <img
                v-else-if="currentThumbnailUrl"
                :src="currentThumbnailUrl"
                :alt="currentVideoCard?.title || 'Video thumbnail'"
                class="w-full h-full object-cover"
            />
            <div
                v-else
                class="w-full h-full bg-linear-to-br"
                :style="{
                    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                }"
            ></div>
        </div>

        <!-- Navigation Arrows -->
        <div
            v-if="hasVideoCards && videoCards.length > 1"
            class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none z-20"
        >
            <!-- Previous Arrow -->
            <button
                v-if="canGoPrevious"
                @click="goToPrevious"
                class="pointer-events-auto bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all"
                :class="textColor"
            >
                <ChevronLeftIcon class="size-6" />
            </button>
            <div v-else class="w-10"></div>

            <!-- Next Arrow -->
            <button
                v-if="canGoNext"
                @click="goToNext"
                class="pointer-events-auto bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all"
                :class="textColor"
            >
                <ChevronRightIcon class="size-6" />
            </button>
            <div v-else class="w-10"></div>
        </div>

        <!-- Content Overlay -->
        <div
            class="relative z-10 flex flex-col justify-between h-full pt-4 px-4 pb-10"
            :class="[textColor, bgOverlay]"
        >
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-x-3 p-4">
                    <!-- Avatar -->
                    <div
                        v-if="avatarUrl"
                        class="size-8 rounded-xl bg-stone-100 overflow-hidden ring-2 ring-white/20"
                    >
                        <img
                            :src="avatarUrl"
                            :alt="title"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div
                        v-else
                        class="flex items-center justify-center size-8 rounded-xl bg-stone-100 overflow-hidden ring-2 ring-white/20"
                    >
                        <span
                            class="text-sm font-bold opacity-70 text-stone-400"
                        >
                            {{ title.charAt(0).toUpperCase() }}
                        </span>
                    </div>

                    <!-- Title & Slug -->
                    <div class="flex flex-col">
                        <h4 class="font-semibold text-sm">{{ title }}</h4>
                    </div>
                </div>

                <!-- Options Menu -->
                <div class="p-4">
                    <button
                        class="opacity-50 hover:opacity-100 transition-opacity text-xl"
                        title="Options"
                    >
                        ⋯
                    </button>
                </div>
            </div>

            <!-- Bottom Section -->
            <div class="flex flex-col items-center justify-center gap-y-5">
                <!-- Pagination Dots -->
                <div v-if="videoCards.length > 1" class="flex gap-x-1.5">
                    <div
                        v-for="(card, index) in videoCards"
                        :key="card.id"
                        class="h-1.5 rounded-full transition-all"
                        :class="[
                            index === currentCardIndex
                                ? 'w-6 bg-white'
                                : 'w-1.5 bg-white/40',
                        ]"
                    ></div>
                </div>

                <!-- Primary CTA Link (from current video card) -->
                <div v-if="primaryCta" class="w-full px-4">
                    <button
                        class="w-full flex items-center justify-center gap-x-2 font-bold text-white px-6 py-3.5 rounded-xl border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                        :style="{
                            backgroundColor: primaryColor,
                            borderColor: primaryColor,
                        }"
                        :class="{
                            'cursor-pointer': interactive,
                            'cursor-default': !interactive,
                        }"
                        @click="
                            handleLinkClick(
                                primaryCta.url,
                                'cta',
                                primaryCta.id
                            )
                        "
                    >
                        <span v-if="primaryCta.icon" class="text-xl">{{
                            primaryCta.icon
                        }}</span>
                        {{ primaryCta.title }}
                    </button>
                </div>

                <!-- Secondary CTA Links (from current video card) -->
                <div
                    v-if="secondaryCtas.length > 0"
                    class="flex flex-col gap-y-2 w-full px-6 max-h-[120px] overflow-y-auto scrollbar-hide"
                >
                    <button
                        v-for="cta in secondaryCtas"
                        :key="cta.id"
                        class="w-full bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-x-2"
                        :class="{
                            'cursor-pointer': interactive,
                            'cursor-default': !interactive,
                        }"
                        @click="handleLinkClick(cta.url, 'cta', cta.id)"
                    >
                        <span v-if="cta.icon" class="text-base">{{
                            cta.icon
                        }}</span>
                        {{ cta.title }}
                    </button>
                </div>

                <!-- Social Links (global) -->
                <div
                    v-if="hasSocialLinks"
                    class="flex justify-center items-center gap-x-2.5 flex-wrap max-w-[280px]"
                >
                    <button
                        v-for="social in socialLinks"
                        :key="social.id"
                        :class="
                            cn(
                                buttonVariants({
                                    variant: 'icon',
                                    size: 'icon',
                                }),
                                'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all',
                                {
                                    'cursor-pointer': interactive,
                                    'cursor-default': !interactive,
                                }
                            )
                        "
                        :title="social.platform"
                        @click="
                            handleLinkClick(social.url, 'social', social.id)
                        "
                    >
                        <component
                            :is="getSocialPlatformIcon(social.platform)"
                            class="size-5"
                        />
                    </button>
                </div>

                <!-- Empty State -->
                <div
                    v-if="!hasAnyContent"
                    class="text-center opacity-60 text-sm py-8"
                >
                    <div
                        class="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10"
                    >
                        <p class="font-medium">No content yet</p>
                        <p class="text-xs mt-1 opacity-70">
                            Add video cards and links to get started
                        </p>
                    </div>
                </div>

                <!-- Powered by -->
                <div
                    class="bg-white text-stone-950 text-xs tracking-wide font-semibold px-4 py-2 rounded-full border border-stone-200"
                >
                    Powered by datomi.app
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
