<script setup lang="ts">
import { useChartFormatter } from "~/composables/useChartFormatter";

const { getLegendValue } = useChartFormatter();

const props = defineProps<{
    chartData: any;
    options: any;
    isDark: boolean;
    hiddenSeries: Set<string>;
}>();

const emit = defineEmits(["toggle", "highlight", "downplay"]);

const legendItems = computed(() => {
    // --- 1. DATA NORMALIZATION (CRITICAL) ---
    const rawData = props.chartData?.rawData;
    if (!rawData) return [];

    // Extract rows and columns safely
    const rows = Array.isArray(rawData) ? rawData : rawData.rows || [];
    const colMap = !Array.isArray(rawData) ? rawData.columns || {} : {};

    if (rows.length === 0) return [];

    const conf = props.chartData?.config || {};
    const mode = conf.legend?.valueMode || "none";
    const palette = props.options?.color || [];

    // Identify which 'valX' keys we actually have in the first row
    const seriesKeys = Object.keys(rows[0]).filter((k) => k.startsWith("val"));

    return seriesKeys.map((key, idx) => {
        // --- 2. NAME RESOLUTION ---
        // Priority: 1. New colMap, 2. Old config overrides, 3. Fallback string
        const name =
            colMap[key] || conf[`${key}Name`] || key.replace("val", "Col ");

        // Pass the full rawData to getLegendValue (it now handles the object/array check)
        const stats = getLegendValue(name, rawData, conf, mode);

        const firstLabel = rows[0]?.label || "";
        const lastLabel = rows[rows.length - 1]?.label || "";
        const prevLabel = rows[rows.length - 2]?.label || "prev";

        let context = "";
        if (mode === "avg") context = "AVG";
        else if (mode === "sum") context = `${firstLabel}—${lastLabel}`;
        else if (mode === "last") context = lastLabel;

        return {
            name,
            color: palette[idx % palette.length],
            value: stats.val,
            context,
            diffPct: stats.diffPct,
            isPositive: stats.diff >= 0,
            prevLabel,
            mode,
        };
    });
});
</script>

<template>
    <div
        v-if="legendItems.length"
        class="flex flex-wrap gap-x-4 gap-y-2 mb-8 shrink-0"
    >
        <div
            v-for="item in legendItems"
            :key="item.name"
            @click="$emit('toggle', item.name)"
            @mouseenter="$emit('highlight', item.name)"
            @mouseleave="$emit('downplay', item.name)"
            class="flex flex-col min-w-[100px] cursor-pointer transition-all duration-200"
            :class="hiddenSeries.has(item.name) ? 'opacity-30' : 'opacity-100'"
        >
            <template v-if="item.mode !== 'none'">
                <div class="flex items-baseline gap-1.5 leading-none">
                    <span
                        class="text-lg md:text-xl lg:text-2xl font-black"
                        :class="isDark ? 'text-white' : 'text-stone-900'"
                    >
                        {{ item.value }}
                    </span>
                    <span
                        class="text-[10px] font-medium opacity-40 text-stone-500"
                    >
                        {{ item.context }}
                    </span>
                </div>

                <div
                    v-if="item.mode === 'last' && item.diffPct"
                    class="flex items-center gap-1.5 mt-0.5"
                >
                    <span
                        class="text-[10px] font-bold"
                        :class="
                            item.isPositive
                                ? 'text-emerald-500'
                                : 'text-rose-500'
                        "
                    >
                        {{ item.diffPct }}
                    </span>
                    <span
                        class="text-[9px] font-bold opacity-30 italic"
                        :class="isDark ? 'text-stone-400' : 'text-stone-500'"
                    >
                        from {{ item.prevLabel }}
                    </span>
                </div>
            </template>

            <div class="flex items-center gap-2 mt-1">
                <div
                    class="size-2 rounded-full shrink-0 shadow-sm"
                    :style="{ backgroundColor: item.color }"
                ></div>
                <span
                    class="text-xs font-medium opacity-60 truncate max-w-[150px]"
                    :class="isDark ? 'text-stone-300' : 'text-stone-600'"
                >
                    {{ item.name }}
                </span>
            </div>
        </div>
    </div>
</template>
