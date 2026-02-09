<script setup lang="ts">
import { PhCaretDown, PhSquaresFour, PhChartBar } from "@phosphor-icons/vue";

const props = defineProps<{
    dashboards: any[];
    currentDashboardName?: string;
    currentDashboardId?: string;
    charts: any[];
    activeChartName?: string;
    activeChartId?: string;
}>();

const emit = defineEmits(["changeDashboard", "changeChart", "goBack"]);
</script>

<template>
    <nav class="flex items-center text-sm">
        <span class="px-2 text-stone-900 font-medium">Dashboards</span>

        <span class="text-stone-300 mx-1">/</span>

        <div class="relative group">
            <button
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-stone-200 transition text-stone-900 font-medium whitespace-nowrap"
            >
                <PhSquaresFour class="size-5 shrink-0" />
                {{ currentDashboardName || "Loading..." }}
                <PhCaretDown class="size-3 text-stone-400" />
            </button>
            <select
                :value="currentDashboardId"
                @change="
                    (e) =>
                        emit(
                            'changeDashboard',
                            (e.target as HTMLSelectElement).value,
                        )
                "
                class="absolute inset-0 opacity-0 cursor-pointer"
            >
                <option v-for="db in dashboards" :key="db.id" :value="db.id">
                    {{ db.title }}
                </option>
            </select>
        </div>

        <span class="text-stone-300 mx-1">/</span>

        <div class="relative group">
            <button
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-stone-900 transition-colors hover:bg-indigo-100 whitespace-nowrap"
            >
                <PhChartBar class="size-5 shrink-0" />
                {{ activeChartName || "Select Chart" }}
                <PhCaretDown class="size-3 opacity-50" />
            </button>

            <select
                :value="activeChartId"
                @change="
                    (e) =>
                        emit(
                            'changeChart',
                            (e.target as HTMLSelectElement).value,
                        )
                "
                class="absolute inset-0 opacity-0 cursor-pointer"
            >
                <option v-for="c in charts" :key="c.id" :value="c.id">
                    {{ c.name }}
                </option>
            </select>
        </div>
    </nav>
</template>
