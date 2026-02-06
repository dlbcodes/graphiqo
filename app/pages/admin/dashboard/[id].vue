<script setup lang="ts">
definePageMeta({ middleware: "admin" });

const route = useRoute();
const store = useDashboardStore();

// 1. Initial Load
onMounted(async () => {
    await store.fetchDashboard(route.params.id as string);
    if (store.currentDashboard?.charts.length && !store.activeChartId) {
        store.activeChartId = store.currentDashboard.charts[0].id;
    }
});

// 2. Active Chart Selector
const activeChart = computed(() => {
    return store.currentDashboard?.charts.find(
        (c) => c.id === store.activeChartId,
    );
});

// 3. Dynamic Multi-Series Chart Logic
const chartOptions = computed(() => {
    let data = activeChart.value?.rawData;
    if (!data || !Array.isArray(data)) return {};

    // 1. FILTER: Only use rows that have a label and at least one value
    const filteredData = data.filter((row) => {
        const hasLabel = row.label && row.label.toString().trim() !== "";
        // Check if any val1...val15 has a number
        const hasValue = Object.keys(row).some(
            (k) => k.startsWith("val") && row[k] !== null && row[k] !== "",
        );
        return hasLabel && hasValue;
    });

    if (filteredData.length === 0) return {};

    const seriesKeys = Object.keys(filteredData[0]).filter((key) =>
        key.startsWith("val"),
    );
    const xAxisData = filteredData.map((row) => row.label);

    const series = seriesKeys.map((key) => ({
        name: key.replace("val", "Column "),
        type: activeChart.value?.type || "bar",
        // Map the filtered data
        data: filteredData.map((row) => Number(row[key]) || 0),
        smooth: true,
        emphasis: { focus: "series" },
    }));

    return {
        tooltip: { trigger: "axis" },
        legend: { type: "scroll", bottom: 0 },
        xAxis: { type: "category", data: xAxisData },
        yAxis: { type: "value" },
        series: series,
    };
});

// 4. Auto-Save Logic
let saveTimeout: any;
watch(
    () => activeChart.value?.rawData,
    (newVal) => {
        if (!newVal) return;

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            store.updateChartData(activeChart.value!.id, { rawData: newVal });
        }, 1000); // 1 second is enough
    },
    { deep: true, flush: "post" }, // 'post' ensures we get the latest data after the UI render
);

const deleteChart = async (id: string) => {
    if (confirm("Are you sure you want to delete this chart?")) {
        await store.removeChart(id);
    }
};
</script>

<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
        <aside class="w-72 bg-white border-r flex flex-col shadow-sm">
            <div class="p-5 border-b flex items-center justify-between">
                <button
                    @click="navigateTo('/admin')"
                    class="text-gray-400 hover:text-indigo-600 transition flex items-center gap-1 text-sm font-medium"
                >
                    <span class="text-lg">←</span> Home
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-2">
                <h2
                    class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2"
                >
                    Dashboard Charts
                </h2>
                <div
                    v-for="chart in store.currentDashboard?.charts"
                    :key="chart.id"
                    class="relative group"
                >
                    <button
                        @click="store.activeChartId = chart.id"
                        :class="[
                            'w-full text-left px-4 py-3 rounded-xl text-sm transition-all',
                            store.activeChartId === chart.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                : 'text-gray-600 hover:bg-gray-100',
                        ]"
                    >
                        {{ chart.name }}
                    </button>
                    <button
                        v-if="store.currentDashboard?.charts.length > 1"
                        @click.stop="deleteChart(chart.id)"
                        class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="p-4 border-t">
                <button
                    @click="
                        store.addChartToDashboard(route.params.id as string)
                    "
                    class="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-all"
                >
                    + New Chart
                </button>
            </div>
        </aside>

        <main class="flex-1 flex flex-col min-w-0">
            <header
                class="h-20 bg-white border-b px-8 flex items-center justify-between"
            >
                <div v-if="activeChart" class="flex items-center gap-6">
                    <input
                        v-model="activeChart.name"
                        @blur="
                            store.updateChartData(activeChart.id, {
                                name: activeChart.name,
                            })
                        "
                        class="text-xl font-bold bg-transparent border-b-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    <div class="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            v-for="t in ['bar', 'line']"
                            :key="t"
                            @click="
                                store.updateChartData(activeChart.id, {
                                    type: t,
                                })
                            "
                            :class="[
                                'px-4 py-1.5 text-xs font-bold rounded-md transition uppercase',
                                activeChart.type === t
                                    ? 'bg-white shadow text-indigo-600'
                                    : 'text-gray-500',
                            ]"
                        >
                            {{ t }}
                        </button>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <span
                        :class="[
                            'text-[10px] font-black uppercase tracking-widest',
                            store.loading
                                ? 'text-amber-500'
                                : 'text-emerald-500',
                        ]"
                        >{{ store.loading ? "Syncing..." : "Ready" }}</span
                    >
                    <button
                        class="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                    >
                        Share Link
                    </button>
                </div>
            </header>

            <div
                v-if="activeChart"
                class="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden min-h-0"
            >
                <div
                    class="col-span-12 lg:col-span-5 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full min-h-0"
                >
                    <div
                        class="px-6 py-4 border-b border-gray-50 flex shrink-0"
                    >
                        <h3
                            class="text-sm font-black text-gray-800 uppercase tracking-tight"
                        >
                            Data Source
                        </h3>
                    </div>

                    <div class="flex-1 min-h-0 flex flex-col relative">
                        <div class="absolute inset-0">
                            <DataSheet v-model="activeChart.rawData" />
                        </div>
                    </div>
                </div>

                <div
                    class="col-span-12 lg:col-span-7 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
                >
                    <div class="flex-1 p-4">
                        <ChartPreview :options="chartOptions" />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
