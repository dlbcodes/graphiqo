<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

definePageMeta({ middleware: "admin" });

const route = useRoute();
const store = useDashboardStore();
const brandStore = useBrandStore();
const { formatOptions } = useChartFormatter();

// 1. UI STATE - Ensure this matches the internal expectation of DockMenu
const activeTab = ref<string | null>(null);
const isLoaded = ref(false);

onMounted(async () => {
    try {
        await Promise.all([
            store.fetchDashboard(route.params.id as string),
            store.fetchDashboards(),
            brandStore.fetchBrands(),
        ]);
    } finally {
        isLoaded.value = true;
    }
});

const activeChart = computed(() => {
    const charts = store.currentDashboard?.charts;
    if (!charts || charts.length === 0) return null;
    const chart = charts.find((c) => c.id === store.activeChartId) || charts[0];

    // Normalize data structure on the fly
    if (chart && (!chart.rawData || Array.isArray(chart.rawData))) {
        chart.rawData = {
            columns: chart.rawData?.columns || {
                val1: "Series 1",
                val2: "Series 2",
            },
            rows: Array.isArray(chart.rawData)
                ? chart.rawData
                : chart.rawData?.rows || [],
        };
    }
    return chart;
});

const linkedBrand = computed(() => {
    const brandId = activeChart.value?.config?.brandProfileId;
    return brandId ? brandStore.brands.find((b) => b.id === brandId) : null;
});

const chartOptions = computed(() => {
    if (!activeChart.value) return {};
    return formatOptions(activeChart.value, linkedBrand.value);
});

const updateChart = (payload: any) => {
    if (activeChart.value) {
        store.updateChartData(activeChart.value.id, payload);
    }
};

// Auto-save logic
const lastSavedState = ref("");
const isSaving = ref(false);
const lastSaved = ref<Date | null>(null);

const debouncedSave = useDebounceFn(async (id: string, data: any) => {
    const currentStateString = JSON.stringify(data);
    if (currentStateString === lastSavedState.value) return;

    isSaving.value = true;
    try {
        await store.updateChartData(id, data);
        lastSavedState.value = currentStateString;
        lastSaved.value = new Date();
    } finally {
        setTimeout(() => {
            isSaving.value = false;
        }, 800);
    }
}, 2000);

watch(
    () => activeChart.value?.rawData, // Make sure this is observing the whole object
    (newVal) => {
        if (newVal) {
            debouncedSave(activeChart.value.id, { rawData: newVal });
        }
    },
    { deep: true },
);
</script>

<template>
    <div
        class="flex h-screen overflow-hidden relative font-sans bg-stone-50 bg-[repeating-linear-gradient(135deg,var(--color-stone-100)_0px,var(--color-stone-100)_1px,transparent_1px,transparent_20px)]"
    >
        <FloatingHelp />

        <DockMenu v-if="isLoaded" v-model="activeTab">
            <template #data>
                <div v-if="activeChart?.rawData" class="h-full w-full grid">
                    <DataSheet
                        v-model="activeChart.rawData"
                        :chart-data="activeChart"
                    />

                    <!-- <GridSheet
                        v-model="activeChart.rawData"
                        :chart-data="activeChart"
                    /> -->
                </div>
            </template>
            <template #type>
                <div v-if="activeChart" class="p-0">
                    <ChartType
                        v-model="activeChart.config"
                        :active-chart="activeChart"
                        @update-type="updateChart"
                    />
                </div>
            </template>
            <template #brand>
                <div v-if="activeChart" class="p-0 h-full">
                    <ChartSettings v-model="activeChart.config" />
                </div>
            </template>
            <template #layout>
                <div v-if="activeChart" class="p-2">
                    <ChartLayout v-model="activeChart.config" />
                </div>
            </template>
        </DockMenu>

        <main
            class="flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out"
        >
            <EditorHeader :is-saving="isSaving" :last-saved="lastSaved" />

            <div
                class="flex-1 px-12 pb-12 flex items-center justify-center min-h-0"
            >
                <div
                    id="main-chart-area"
                    class="w-full h-full max-w-6xl rounded-4xl p-10 transition-all duration-700 relative flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                    :class="
                        activeChart?.config?.darkMode
                            ? 'bg-[#0F0F0F] border-stone-800'
                            : 'bg-white'
                    "
                >
                    <div
                        v-if="!isLoaded || !activeChart"
                        class="flex-1 flex flex-col items-center justify-center gap-y-2"
                    >
                        <Spinner />
                        <div
                            class="animate-pulse text-stone-300 font-medium text-sm"
                        >
                            Loading workspace...
                        </div>
                    </div>

                    <ChartPreview
                        v-else
                        :options="chartOptions"
                        :chart-data="activeChart"
                        :is-dark="activeChart?.config?.darkMode ?? false"
                        @updateMetadata="updateChart"
                    />
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Added explicit transition for the main content shift */
main {
    transition: padding-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
