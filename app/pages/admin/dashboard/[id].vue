<script setup lang="ts">
import {
    PhShareNetwork,
    PhList,
    PhPresentation,
    PhQuestion,
} from "@phosphor-icons/vue";

definePageMeta({ middleware: "admin" });

const route = useRoute();
const store = useDashboardStore();
const brandStore = useBrandStore();
const { formatOptions } = useChartFormatter();

// Local UI State
const activeTab = ref<"data" | "type" | "settings" | "brand" | null>(null);

onMounted(async () => {
    await Promise.all([
        store.fetchDashboard(route.params.id as string),
        store.fetchDashboards(),
        brandStore.fetchBrands(),
    ]);
});

const activeChart = computed(() => {
    const charts = store.currentDashboard?.charts;
    if (!charts || charts.length === 0) return null;
    return charts.find((c) => c.id === store.activeChartId) || charts[0];
});

const linkedBrand = computed(() => {
    const brandId = activeChart.value?.config?.brandProfileId;
    return brandId ? brandStore.brands.find((b) => b.id === brandId) : null;
});

const chartOptions = computed(() =>
    formatOptions(activeChart.value, linkedBrand.value),
);

const updateChart = (payload: any) => {
    if (activeChart.value) {
        store.updateChartData(activeChart.value.id, payload);
    }
};
</script>

<template>
    <div
        class="flex h-screen overflow-hidden relative font-sans bg-stone-50 bg-[repeating-linear-gradient(135deg,var(--color-stone-100)_0px,var(--color-stone-100)_1px,transparent_1px,transparent_20px)]"
    >
        <div class="fixed left-8 bottom-8 z-50">
            <button
                class="size-12 rounded-full bg-white shadow-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-all hover:scale-105 active:scale-95"
            >
                <PhQuestion class="size-6" />
            </button>
        </div>

        <DockMenu v-model="activeTab">
            <template #data>
                <div v-if="activeChart" class="h-full w-full grid">
                    <DataSheet v-model="activeChart.rawData" />
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
            <header
                class="h-18 px-6 flex items-center justify-between shrink-0"
            >
                <div class="flex items-center gap-3">
                    <Button to="/admin" variant="icon" size="icon">
                        <PhList class="size-5 shrink-0" />
                    </Button>

                    <BreadcrumbNav
                        :dashboards="store.dashboards"
                        :current-dashboard-name="store.currentDashboard?.title"
                        :charts="store.currentDashboard?.charts || []"
                        :active-chart-id="store.activeChartId"
                        :active-chart-name="activeChart?.name"
                        :active-chart-type="activeChart?.type"
                        @go-back="navigateTo('/admin')"
                        @change-dashboard="
                            (id) => navigateTo(`/admin/dashboard/${id}`)
                        "
                        @change-chart="(id) => (store.activeChartId = id)"
                    />
                </div>

                <div class="flex items-center gap-3">
                    <Button variant="secondary">
                        <PhPresentation class="size-5 shrink-0" />
                        Presentation
                    </Button>
                    <Button>
                        <PhShareNetwork class="size-5 shrink-0" />
                        Share
                    </Button>
                </div>
            </header>

            <div
                class="flex-1 px-12 pb-12 flex items-center justify-center min-h-0"
            >
                <div
                    class="w-full h-full max-w-6xl rounded-4xl p-10 transition-all duration-700 relative flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                    :class="
                        activeChart?.config?.darkMode
                            ? 'bg-[#0F0F0F] border-stone-800'
                            : 'bg-white'
                    "
                >
                    <div
                        v-if="!activeChart"
                        class="flex-1 flex items-center justify-center"
                    >
                        <div
                            class="animate-pulse text-stone-300 font-black uppercase text-[10px] tracking-[0.3em]"
                        >
                            Loading Canvas...
                        </div>
                    </div>

                    <ChartPreview
                        v-else
                        :options="chartOptions"
                        :chart-data="activeChart"
                        @updateMetadata="updateChart"
                    />
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
main {
    transition: padding-left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
:deep(.ve-container) {
    border: none !important;
    background: transparent !important;
}
input:focus {
    box-shadow: none !important;
}
</style>
