<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

// =======================
// State & Data Fetching
// =======================
const currentCardIndex = ref(0);

// useFetch is reactive and handles SSR/Client hydration automatically
const {
    data: page,
    pending: loading,
    error,
} = await useFetch(`/api/v1/public/${slug}`, {
    key: `public-page-${slug}`,
    // Ensure we pick only the data we need or handle potential nulls
});

// =======================
// Computed Properties
// =======================
// We use 'page.value' because useFetch returns a Ref
const pageData = computed(() => ({
    title: page.value?.title || "Untitled",
    bio: page.value?.bio || "",
    avatarUrl: page.value?.avatarUrl || "",
    primaryColor: page.value?.primaryColor || "#4f39f6",
}));

const videoCards = computed(() =>
    [...(page.value?.videoCards || [])]
        .filter((c) => c.isActive !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
);

const socialLinks = computed(() =>
    [...(page.value?.socialLinks || [])]
        .filter((l) => l.isActive)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
);

const pageLinks = computed(() =>
    [...(page.value?.pageLinks || [])]
        .filter((l) => l.isActive)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
);

const showFinalScreen = computed(
    () => currentCardIndex.value === videoCards.value.length,
);

// =======================
// Navigation Handlers
// =======================
const handleIndexChange = (newIndex: number) => {
    currentCardIndex.value = newIndex;
};
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center bg-stone-100 overflow-hidden md:p-4"
    >
        <LoadingState v-if="loading && !page" />

        <!-- <div v-else-if="error" class="text-center p-4">
            <p class="text-red-500">Failed to load content.</p>
            <button @click="() => refresh()" class="mt-2 text-sm underline">
                Retry
            </button>
        </div> -->

        <div
            v-else-if="page"
            class="w-full h-dvh md:w-[380px] md:h-auto md:aspect-9/16 md:rounded-[2.5rem] md:border md:border-stone-200 md:shadow-lg overflow-hidden relative bg-stone-900"
        >
            <VideoContainer
                v-if="!showFinalScreen"
                :video-cards="videoCards"
                :current-index="currentCardIndex"
                :page-data="pageData"
                :social-links="socialLinks"
                :total-items="videoCards.length + 1"
                @update:index="handleIndexChange"
            />

            <FinalScreen
                v-else
                :page-data="pageData"
                :social-links="socialLinks"
                :page-links="pageLinks"
                :total-items="videoCards.length + 1"
                :current-index="currentCardIndex"
                @update:index="handleIndexChange"
            />

            <Powered />
        </div>
    </div>
</template>
