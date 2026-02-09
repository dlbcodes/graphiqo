<script setup lang="ts">
import {
    PhArrowLeft,
    PhShareNetwork,
    PhChartLine,
    PhHouse,
    PhDownloadSimple,
} from "@phosphor-icons/vue";
import Button from "~/components/base/Button.vue";

definePageMeta({ middleware: "admin" });

const route = useRoute();
const store = useDashboardStore();
const brandStore = useBrandStore();
const { formatOptions } = useChartFormatter();

// Local UI State
const activeTab = ref<"data" | "type" | "settings" | "brand" | null>(null);

onMounted(async () => {
    await store.fetchDashboard(route.params.id as string);
    await brandStore.fetchBrands();
});

// Computed: Get the currently active chart object
const activeChart = computed(() => {
    const charts = store.currentDashboard?.charts;
    if (!charts || charts.length === 0) return null;
    return charts.find((c) => c.id === store.activeChartId) || charts[0];
});

// Computed: Format options for ECharts using the active chart and brand
const chartOptions = computed(() =>
    formatOptions(activeChart.value, brandStore.activeBrand),
);

// Helper: Quick update for the store
const updateChart = (data: any) => {
    if (activeChart.value) {
        store.updateChartData(activeChart.value.id, data);
    }
};
</script>

<template>
    <div class="flex h-screen overflow-hidden relative font-sans bg-[#F9F8F6]">
        <DockMenu v-model="activeTab">
            <template #data>
                <div v-if="activeChart" class="h-full">
                    <DataSheet v-model="activeChart.rawData" />
                </div>
            </template>

            <template #type>
                <div v-if="activeChart" class="p-8 grid grid-cols-2 gap-4">
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
                        @click="updateChart({ type: t })"
                        :class="[
                            'py-6 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-3',
                            activeChart.type === t
                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm'
                                : 'border-stone-50 hover:border-stone-200 text-stone-400 bg-white',
                        ]"
                    >
                        <PhChartLine v-if="t === 'line'" class="size-5" />
                        {{ t }}
                    </button>
                </div>
            </template>

            <template #brand>
                <div v-if="activeChart" class="p-2">
                    <ChartSettings v-model="activeChart.config" />
                </div>
            </template>

            <template #settings>
                <div v-if="activeChart" class="p-2">
                    <ChartSettings v-model="activeChart.config" />
                </div>
            </template>
        </DockMenu>

        <main
            class="flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out"
            :class="activeTab ? 'pl-[400px]' : 'pl-0'"
        >
            <header
                class="h-16 px-4 flex items-center justify-between shrink-0"
            >
                <div class="flex items-center gap-x-2">
                    <Button to="/admin" variant="icon" size="icon">
                        <PhHouse class="size-5 shrink-0" />
                    </Button>
                </div>
                <div>
                    <Button to="/admin" size="sm">
                        <PhDownloadSimple class="size-5 shrink-0" />
                        Share
                    </Button>
                </div>
            </header>

            <header
                class="h-24 px-12 flex items-center justify-between shrink-0"
            >
                <div class="flex items-center gap-6">
                    <button
                        @click="navigateTo('/admin')"
                        class="p-2.5 rounded-full bg-white border border-stone-200 hover:bg-stone-50 transition shadow-sm text-stone-600"
                    >
                        <PhArrowLeft class="size-5" />
                    </button>
                    <div class="flex flex-col">
                        <input
                            v-if="activeChart"
                            v-model="activeChart.name"
                            @blur="updateChart({ name: activeChart.name })"
                            class="text-xl font-bold bg-transparent border-none focus:outline-none text-stone-800 p-0"
                        />
                        <span
                            class="text-[10px] font-bold text-stone-400 uppercase tracking-widest"
                        >
                            Editing Dashboard:
                            {{ store.currentDashboard?.name }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <select
                        :value="store.activeChartId || activeChart?.id"
                        @change="
                            (e) =>
                                (store.activeChartId = (
                                    e.target as HTMLSelectElement
                                ).value)
                        "
                        class="bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-bold text-stone-600 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option
                            v-for="c in store.currentDashboard?.charts"
                            :key="c.id"
                            :value="c.id"
                        >
                            {{ c.name }}
                        </option>
                    </select>

                    <button
                        class="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all"
                    >
                        <PhShareNetwork class="size-4" />
                        Share
                    </button>
                </div>
            </header>

            <div class="flex-1 px-12 pb-12 flex items-center justify-center">
                <div
                    class="w-full h-full max-w-6xl rounded-[3rem] p-12 transition-all duration-700 border border-white relative overflow-hidden group shadow-2xl"
                    :class="
                        activeChart?.config?.darkMode
                            ? 'bg-[#0F0F0F] border-stone-800'
                            : 'bg-white'
                    "
                >
                    <div
                        v-if="!activeChart"
                        class="absolute inset-0 flex items-center justify-center"
                    >
                        <div
                            class="animate-pulse text-stone-300 font-black uppercase text-[10px] tracking-[0.3em]"
                        >
                            Loading Canvas...
                        </div>
                    </div>

                    <ChartPreview v-else :options="chartOptions" />
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Main Transition for Layout Nudge */
main {
    transition: padding-left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

:deep(.ve-container) {
    border: none !important;
    background: transparent !important;
}

/* Custom Input Focus */
input:focus {
    box-shadow: none !important;
}
</style>
