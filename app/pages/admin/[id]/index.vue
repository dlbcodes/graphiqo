<script setup lang="ts">
const pageStore = usePageStore();
</script>

<template>
    <div
        class="grid md:grid-cols-[minmax(314px,1fr)_minmax(180px,280px)] lg:grid-cols-[minmax(484px,1fr)_minmax(200px,400px)] xl:grid-cols-[minmax(570px,1fr)_minmax(200px,460px)] h-full"
    >
        <div
            class="flex flex-col gap-y-10 h-full overflow-y-auto pt-10 pb-20 px-8 no-scrollbar"
        >
            <Header
                title="Your page"
                subtitle="Manage your profile, social links, videos, and featured
                    links."
            />

            <div class="flex flex-col gap-y-2">
                <!-- User name and bio -->
                <div>
                    <div class="flex items-center gap-x-2">
                        <!-- <div class="bg-stone-200 rounded-2xl size-12"></div> -->
                        <AvatarManager
                            v-if="pageStore.currentPage?.id"
                            :page-id="pageStore.currentPage?.id"
                        />
                        <EntityManager
                            v-if="pageStore.currentPage?.id"
                            :page-id="pageStore.currentPage?.id"
                        />
                    </div>
                </div>
                <!-- End User name and bio -->

                <!-- Social -->
                <SocialsManager
                    v-if="pageStore.currentPage?.id"
                    :page-id="pageStore.currentPage?.id"
                />
                <!-- End Social -->
            </div>

            <MediaManager
                v-if="pageStore.currentPage?.id"
                :page-id="pageStore.currentPage?.id"
            />

            <!-- Links -->
            <LinksManager
                v-if="pageStore.currentPage?.id"
                :page-id="pageStore.currentPage?.id"
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
