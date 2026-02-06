<script setup lang="ts">
import { buttonVariants } from "~/variants/ButtonVariants";

const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);

// Social links - sorted and active only
const socialLinks = computed(() => {
    return [...(currentPage.value?.socialLinks || [])]
        .filter((link) => link.isActive)
        .sort((a, b) => a.order - b.order);
});

const pageLinks = computed(() => {
    return [...(currentPage.value?.pageLinks || [])]
        .filter((link) => link.isActive)
        .sort((a, b) => a.order - b.order);
});

const hasSocialLinks = computed(() => socialLinks.value.length > 0);
const hasPageLinks = computed(() => pageLinks.value.length > 0);

// Handle link click
const handleLinkClick = (
    url: string,
    type: "cta" | "social" | "page",
    id: string
) => {
    // You can add analytics tracking here
    console.log(`Clicked ${type} link:`, id, url);
    window.open(url, "_blank", "noopener,noreferrer");
};
</script>

<template>
    <div
        class="grid md:grid-cols-[minmax(314px,1fr)_minmax(180px,280px)] lg:grid-cols-[minmax(484px,1fr)_minmax(200px,400px)] xl:grid-cols-[minmax(570px,1fr)_minmax(200px,460px)] h-full"
    >
        <div
            class="px-10 pt-20 flex flex-col gap-y-6 w-[380px] aspect-9/16 rounded-[2.5rem] border border-stone-200 shadow-lg overflow-hidden relative bg-stone-50 bg-[repeating-linear-gradient(135deg,var(--color-stone-100)_0px,var(--color-stone-100)_1px,transparent_1px,transparent_20px)]"
        >
            <!-- Header -->
            <div class="flex flex-col gap-y-2 items-center">
                <Avatar :src="currentPage?.avatarUrl" size="xl" />
                <div class="flex flex-col items-center">
                    <h2 class="text-lg font-medium">
                        {{ currentPage?.title }}
                    </h2>
                    <p class="text-stone-600 text-sm">{{ currentPage?.bio }}</p>
                </div>
            </div>
            <!-- End Header -->

            <!-- Social -->
            <div
                v-if="hasSocialLinks"
                class="flex justify-center items-center gap-x-2.5 flex-wrap"
            >
                <button
                    v-for="social in socialLinks"
                    :key="social.id"
                    :class="
                        cn(
                            buttonVariants({
                                variant: 'icon',
                                size: 'icon',
                            })
                        )
                    "
                    :title="social.platform"
                    @click="handleLinkClick(social.url, 'social', social.id)"
                >
                    <component
                        :is="getSocialPlatformIcon(social.platform)"
                        class="size-5"
                    />
                </button>
            </div>
            <!-- End Social -->

            <!-- Links -->
            <div v-if="hasPageLinks" class="flex flex-col gap-y-2">
                <button
                    v-for="link in pageLinks"
                    :key="link.id"
                    :class="
                        cn(
                            buttonVariants({
                                variant: 'secondary',
                                size: 'lg',
                            })
                        )
                    "
                    :title="link.title"
                    @click="handleLinkClick(link.url, 'social', link.id)"
                >
                    {{ link.title }}
                </button>
            </div>
            <!-- End Links -->
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
