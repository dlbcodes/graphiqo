<script setup lang="ts">
const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);
</script>

<template>
    <div
        class="grid md:grid-cols-[minmax(314px,1fr)_minmax(180px,280px)] lg:grid-cols-[minmax(484px,1fr)_minmax(200px,400px)] xl:grid-cols-[minmax(570px,1fr)_minmax(200px,460px)] h-full"
    >
        <div
            class="flex flex-col gap-y-10 h-full overflow-y-auto pt-10 pb-20 px-8 no-scrollbar"
        >
            <!-- Header -->
            <div>
                <h2 class="text-2xl font-semibold text-stone-900">
                    Page Settings
                </h2>
                <p class="text-sm text-stone-600">
                    Manage SEO, analytics, and content settings for your page.
                </p>
            </div>

            <Content
                v-if="currentPage?.id"
                :page-id="currentPage?.id"
                :is-published="currentPage.isPublished"
                :is-nsfw="currentPage.isNsfw"
                :slug="currentPage.slug"
            />

            <Seo
                v-if="currentPage?.id"
                :page-id="currentPage?.id"
                :meta-title="currentPage.metaTitle"
                :meta-description="currentPage.metaDescription"
            />

            <Analytics
                v-if="currentPage"
                :page-id="pageId"
                :google-analytics-id="currentPage.googleAnalyticsId"
                :facebook-pixel-id="currentPage.facebookPixelId"
            />
        </div>
        <div
            class="relative flex justify-center items-center h-screen max-h-screen bg-stone-100"
        >
            <LinkOptions
                v-if="pageStore.currentPage?.id"
                :page-id="pageStore.currentPage?.id"
            />
            <PreviewManager
                v-if="pageStore.currentPage?.id"
                :page-id="pageStore.currentPage?.id"
            />
        </div>
    </div>
</template>
