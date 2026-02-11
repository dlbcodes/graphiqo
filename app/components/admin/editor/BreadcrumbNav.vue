<script setup lang="ts">
import { computed } from "vue";
import {
    PhCaretDown,
    PhSquaresFour,
    PhChartBar,
    PhHouse,
} from "@phosphor-icons/vue";
import { CHART_TYPES } from "@/utils/chartTypes";

const props = defineProps<{
    dashboards: any[];
    currentDashboardName?: string;
    currentDashboardId?: string;
    charts: any[];
    activeChartName?: string;
    activeChartId?: string;
    activeChartType?: string;
}>();

const emit = defineEmits(["changeDashboard", "changeChart", "goBack"]);

const activeIcon = computed(() => {
    const type = CHART_TYPES.find((t) => t.key === props.activeChartType);
    return type ? type.icon : PhChartBar;
});

// Map dashboards for the Dropdown component
const dashboardOptions = computed(() =>
    props.dashboards.map((db) => ({
        label: db.title,
        icon: PhSquaresFour,
        action: () => emit("changeDashboard", db.id),
    })),
);

// Map charts for the Dropdown component
const chartOptions = computed(() =>
    props.charts.map((c) => {
        const typeInfo = CHART_TYPES.find((t) => t.key === c.type);
        return {
            label: c.name,
            icon: typeInfo ? typeInfo.icon : PhChartBar,
            action: () => emit("changeChart", c.id),
        };
    }),
);
</script>

<template>
    <nav class="flex items-center text-sm font-medium">
        <Button to="/admin" variant="icon" size="icon">
            <PhHouse class="size-5 shrink-0" />
        </Button>

        <span class="text-stone-300 mx-1">/</span>

        <div class="flex items-center group">
            <span class="pl-2 pr-1 text-stone-900 capitalize">
                {{ currentDashboardName || "Loading..." }}
            </span>

            <Dropdown :options="dashboardOptions" class="inline-flex">
                <button
                    class="p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-900"
                >
                    <PhCaretDown class="size-3" weight="bold" />
                </button>
            </Dropdown>
        </div>

        <span class="text-stone-300 mx-1">/</span>

        <div class="flex items-center group">
            <div class="flex items-center gap-2 pl-2 pr-1 text-stone-900">
                <component :is="activeIcon" class="size-4 text-stone-500" />
                <span class="capitalize">{{
                    activeChartName || "Select Chart"
                }}</span>
            </div>

            <Dropdown :options="chartOptions" class="inline-flex">
                <button
                    class="p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-900"
                >
                    <PhCaretDown class="size-3" weight="bold" />
                </button>
            </Dropdown>
        </div>
    </nav>
</template>
