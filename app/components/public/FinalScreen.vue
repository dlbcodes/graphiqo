<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/24/outline";
import { getSocialPlatformIcon } from "~/utils/socialPlatforms";

interface Props {
    pageData: {
        title: string;
        bio: string;
        avatarUrl: string;
        primaryColor: string;
    };
    socialLinks: any[];
    pageLinks: any[];
    totalItems: number;
    currentIndex: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "update:index": [number];
}>();

const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
};

const handleProgressBarClick = (index: number) => {
    emit("update:index", index);
};

const goBack = () => {
    emit("update:index", props.currentIndex - 1);
};

// All items are complete on final screen
const getCardProgress = (index: number) => {
    return index <= props.currentIndex ? 100 : 0;
};

// Tap navigation - click left side to go back
const handleTap = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    // Only handle left side tap (left third of screen)
    if (x < width / 3) {
        goBack();
    }
};
</script>

<template>
    <div class="relative w-full h-full cursor-pointer" @click="handleTap">
        <!-- Progress Bar -->
        <ProgressBar
            :total-items="totalItems"
            :current-index="currentIndex"
            :get-progress="getCardProgress"
            @click-bar="handleProgressBarClick"
        />

        <!-- Back Button -->
        <button @click.stop="goBack" class="absolute top-14 left-4 z-50">
            <ChevronLeftIcon class="size-5 text-stone-700" />
        </button>

        <!-- Final Screen Content (NO gradient overlay) -->
        <div
            class="absolute inset-0 bg-white flex flex-col px-8 pt-24 gap-y-6 overflow-y-auto no-scrollbar pb-24"
        >
            <!-- Subtle top fade -->
            <div
                class="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-stone-50 via-stone-50/80 to-transparent pointer-events-none"
            />

            <!-- Avatar & Profile -->
            <div class="flex flex-col text-left gap-y-3">
                <Avatar
                    :src="pageData.avatarUrl"
                    :name="pageData.title"
                    size="5xl"
                />
                <div>
                    <h2 class="text-2xl font-semibold">
                        {{ pageData.title }}
                    </h2>
                    <p class="text-base font-light text-stone-700 leading-6">
                        {{ pageData.bio }}
                    </p>
                </div>
            </div>

            <!-- Social Links -->
            <div
                v-if="socialLinks.length"
                class="flex justify-center gap-3 flex-wrap"
            >
                <button
                    v-for="s in socialLinks"
                    :key="s.id"
                    class="bg-stone-50 border border-black/5 p-3 rounded-full active:scale-90 transition-transform"
                    @click.stop="handleLinkClick(s.url)"
                >
                    <component
                        :is="getSocialPlatformIcon(s.platform)"
                        class="size-5 text-stone-700"
                    />
                </button>
            </div>

            <!-- Page Links -->
            <div class="flex flex-col gap-y-2.5 antialiased">
                <button
                    v-for="link in pageLinks"
                    :key="link.id"
                    class="flex items-center gap-x-3 flex-1 shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06)] py-4 px-5 rounded-2xl hover:bg-[#fbfbfb]"
                    @click.stop="handleLinkClick(link.url)"
                >
                    <span
                        v-if="link.thumbnailType === 'FAVICON'"
                        class="size-8 flex items-center justify-center rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                    >
                        <img
                            :src="`https://www.google.com/s2/favicons?domain=${link.url}&sz=48`"
                            alt="Favicon"
                            class="shrink-0"
                        />
                    </span>
                    <span class="flex-1 text-left text-sm text-black">{{
                        link.title
                    }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
