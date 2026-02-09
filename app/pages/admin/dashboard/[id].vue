<script setup lang="ts">
definePageMeta({ middleware: "admin" });

const route = useRoute();
const store = useDashboardStore();
const brandStore = useBrandStore();
const { formatOptions } = useChartFormatter();

onMounted(async () => {
    await store.fetchDashboard(route.params.id as string);
    await brandStore.fetchBrands();
});

const activeChart = computed(() => {
    const charts = store.currentDashboard?.charts;
    if (!charts || charts.length === 0) return null;

    // Find by ID, or default to the first chart in the list
    return charts.find((c) => c.id === store.activeChartId) || charts[0];
});

// The one-line chart options
const chartOptions = computed(() =>
    formatOptions(activeChart.value, brandStore.activeBrand),
);

const deleteChart = async (id: string) => {
    if (confirm("Delete this chart?")) await store.removeChart(id);
};
</script>

<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
        <aside class="w-72 bg-white border-r flex flex-col">
            <div class="p-5 border-b font-bold">Charts</div>
            <div class="flex-1 p-4 space-y-2 overflow-y-auto">
                <button
                    v-for="chart in store.currentDashboard?.charts"
                    @click="store.activeChartId = chart.id"
                    :class="[
                        'w-full text-left p-3 rounded-xl transition',
                        store.activeChartId === chart.id
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-gray-100',
                    ]"
                >
                    {{ chart.name }}
                </button>
            </div>
            <div class="p-4 border-t">
                <button
                    @click="
                        store.addChartToDashboard(route.params.id as string)
                    "
                    class="w-full py-2 border-2 border-dashed rounded-xl"
                >
                    + New
                </button>
            </div>
        </aside>

        <main class="flex-1 flex flex-col min-w-0">
            <header
                class="h-16 bg-white border-b px-6 flex items-center justify-between"
            >
                <input
                    v-if="activeChart"
                    v-model="activeChart.name"
                    @blur="
                        store.updateChartData(activeChart.id, {
                            name: activeChart.name,
                        })
                    "
                    class="font-bold border-none"
                />
                <div
                    v-if="activeChart"
                    class="flex bg-gray-100 p-1 rounded-xl gap-1"
                >
                    <button
                        v-for="t in [
                            'bar',
                            'line',
                            'area',
                            'scatter',
                            'step',
                            'pie',
                            'donut',
                        ]"
                        :key="t"
                        @click="
                            store.updateChartData(activeChart.id, { type: t })
                        "
                        :class="[
                            'px-3 py-1.5 text-[9px] font-black rounded-lg transition uppercase tracking-tighter',
                            activeChart?.type === t // Added ? here
                                ? 'bg-white shadow text-indigo-600'
                                : 'text-gray-400 hover:text-gray-600',
                        ]"
                    >
                        {{ t }}
                    </button>
                </div>
            </header>

            <div
                v-if="activeChart"
                class="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden"
            >
                <div class="col-span-3 bg-white rounded-3xl border relative">
                    <DataSheet v-model="activeChart.rawData" />
                </div>
                <div class="col-span-9 flex gap-4">
                    <ChartSettings v-model="activeChart.config" />
                    <div class="flex-1 bg-white rounded-3xl border p-4">
                        <ChartPreview :options="chartOptions" />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
