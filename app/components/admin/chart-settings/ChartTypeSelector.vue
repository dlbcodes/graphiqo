<script setup lang="ts">
import { CHART_TYPES } from "@/utils/chartTypes";

const props = defineProps<{
    currentType: string;
}>();

// We define a specific event for the type change
const emit = defineEmits(["change-type"]);
</script>

<template>
    <div class="p-2 grid grid-cols-3 gap-2">
        <button
            v-for="chart in CHART_TYPES"
            :key="chart.key"
            @click="emit('change-type', chart.key)"
            :class="[
                'p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2',
                currentType === chart.key
                    ? 'border-stone-900 bg-stone-50 shadow-sm'
                    : 'border-stone-100 hover:border-stone-200 bg-white',
            ]"
        >
            <component
                :is="chart.icon"
                class="size-5"
                :class="
                    currentType === chart.key
                        ? 'text-stone-900'
                        : 'text-stone-400'
                "
                :weight="currentType === chart.key ? 'fill' : 'regular'"
            />
            <span class="text-[9px] font-black uppercase tracking-tight">
                {{ chart.key }}
            </span>
        </button>
    </div>
</template>
