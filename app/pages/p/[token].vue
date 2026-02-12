<script setup lang="ts">
const route = useRoute();
const { formatOptions } = useChartFormatter();

// Fetch only from the public endpoint
const { data: chart, pending } = await useFetch(
    `/api/v1/public/chart/${route.params.token}`,
);

const formattedOptions = computed(() => {
    if (!chart.value) return {};
    // Pass null for brand if you want a neutral public look,
    // or fetch brand data if the chart config requires it.
    return formatOptions(chart.value, null);
});

// SEO: Top Developer Move
useHead({
    title: chart.value?.name || "Public Chart",
    meta: [
        {
            name: "description",
            content: `View ${chart.value?.name} data visualization.`,
        },
        { property: "og:image", content: `/api/og/${route.params.token}` }, // Bonus: OG Image route
    ],
});
</script>

<template>
    <div
        class="min-h-screen bg-white flex flex-col items-center justify-center"
    >
        <div v-if="pending" class="animate-pulse flex flex-col items-center">
            <div class="h-8 w-64 bg-stone-100 rounded mb-4"></div>
            <div
                class="h-[400px] w-full max-w-4xl bg-stone-50 rounded-xl"
            ></div>
        </div>

        <template v-else-if="chart">
            <div class="w-full max-w-5xl">
                <div
                    class="w-full h-full max-w-6xl rounded-4xl px-10 pt-10 pb-6 transition-all duration-700 relative flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                    :class="
                        chart?.config?.darkMode
                            ? 'bg-[#0F0F0F] border-stone-800'
                            : 'bg-white'
                    "
                >
                    <ChartPreview
                        :options="formattedOptions"
                        :chart-data="chart"
                        readonly
                    />
                </div>

                <div
                    class="mt-2 flex justify-end items-center text-stone-500 text-sm"
                >
                    <NuxtLink
                        to="/"
                        class="font-bold text-stone-900 hover:underline"
                    >
                        Create your own chart →
                    </NuxtLink>
                </div>
            </div>
        </template>
    </div>
</template>
