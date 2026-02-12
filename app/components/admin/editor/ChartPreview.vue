<script setup lang="ts">
import {
    ref,
    shallowRef,
    computed,
    watch,
    onMounted,
    onUnmounted,
    nextTick,
} from "vue";
import * as echarts from "echarts";
import ChartLegend from "./ChartLegend.vue";

const props = defineProps<{
    options: any;
    chartData: any;
    readonly?: boolean;
}>();

const emit = defineEmits(["updateMetadata"]);

const chartRef = ref<HTMLElement | null>(null);
const chartInstance = shallowRef<echarts.ECharts | null>(null);
const hiddenSeries = ref(new Set<string>());

const config = computed(() => props.chartData?.config || {});
const isDark = computed(() => config.value.darkMode);

// Local temporary name to handle input before sync
const localName = ref(props.chartData?.name || "");

watch(
    () => props.chartData?.name,
    (newVal) => {
        if (newVal !== undefined) localName.value = newVal;
    },
    { immediate: true }, // Ensures it populates on refresh/mount
);

const updateConfig = (key: string, value: string) => {
    emit("updateMetadata", { config: { ...config.value, [key]: value } });
};

// --- ECHARTS BRIDGE METHODS ---
const handleToggle = (name: string) => {
    if (!chartInstance.value) return;
    chartInstance.value.dispatchAction({
        type: "legendToggleSelect",
        name: name,
    });

    if (hiddenSeries.value.has(name)) {
        hiddenSeries.value.delete(name);
    } else {
        hiddenSeries.value.add(name);
    }
};

const handleHighlight = (name: string) => {
    if (!chartInstance.value || hiddenSeries.value.has(name)) return;
    chartInstance.value.dispatchAction({ type: "highlight", seriesName: name });
};

const handleDownplay = (name: string) => {
    if (!chartInstance.value) return;
    chartInstance.value.dispatchAction({ type: "downplay", seriesName: name });
};

// --- ECHARTS LIFECYCLE ---
watch(
    () => props.options,
    (newOptions) => {
        if (chartInstance.value && newOptions) {
            nextTick(() => {
                try {
                    chartInstance.value?.setOption(newOptions, {
                        notMerge: true,
                    });
                } catch (e) {
                    console.warn("ECharts sync delayed:", e);
                }
            });
        }
    },
    { deep: true },
);

onMounted(() => {
    if (chartRef.value) {
        chartInstance.value = echarts.init(chartRef.value, null, {
            renderer: "canvas",
            useDirtyRect: false,
            // CRITICAL: This keeps the pixels "alive" so html2canvas can grab them
            devicePixelRatio: 2,
            // If using native ECharts options:
            // renderer: 'canvas',
            // preserveDrawingBuffer: true
        });
        if (props.options) chartInstance.value.setOption(props.options);
        window.addEventListener("resize", () => chartInstance.value?.resize());
    }
});

onUnmounted(() => {
    chartInstance.value?.dispose();
    window.removeEventListener("resize", () => chartInstance.value?.resize());
});
</script>

<template>
    <div
        class="h-full w-full flex flex-col font-sans group"
        :class="{ 'is-readonly': readonly }"
    >
        <div
            v-if="!config.hideTitle || !config.hideSubtitle"
            class="mb-6 shrink-0 text-left space-y-0"
        >
            <component
                :is="readonly ? 'h1' : 'input'"
                v-if="!config.hideTitle"
                :value="localName"
                @input="(e: any) => (localName = e.target.value)"
                @blur="$emit('updateMetadata', { name: localName })"
                placeholder="Chart Title..."
                class="w-full text-lg font-semibold tracking-tight bg-transparent border-none focus:ring-0 p-0 placeholder:text-stone-300 transition-colors"
                :class="isDark ? 'text-white' : 'text-stone-900'"
            >
                <template v-if="readonly">{{ localName }}</template>
            </component>

            <component
                :is="readonly ? 'p' : 'input'"
                v-if="!config.hideSubtitle && (!readonly || config.subtitle)"
                :value="config.subtitle"
                @input="(e: any) => updateConfig('subtitle', e.target.value)"
                placeholder="Add a subtitle..."
                class="w-full text-sm font-medium bg-transparent border-none focus:ring-0 p-0 opacity-60 placeholder:text-stone-300"
                :class="isDark ? 'text-stone-400' : 'text-stone-500'"
            >
                <template v-if="readonly">{{ config.subtitle }}</template>
            </component>
        </div>

        <ChartLegend
            v-if="config.legend?.show !== false"
            :chart-data="chartData"
            :options="options"
            :is-dark="isDark"
            :hidden-series="hiddenSeries"
            @toggle="handleToggle"
            @highlight="handleHighlight"
            @downplay="handleDownplay"
        />

        <div class="flex-1 relative min-h-[200px]">
            <div ref="chartRef" class="absolute inset-0 w-full h-full"></div>
        </div>

        <div
            v-if="
                (!readonly && (!config.hideNotes || !config.hideSource)) ||
                (readonly &&
                    ((config.notes && !config.hideNotes) || !config.hideSource))
            "
            class="mt-0 flex flex-col justify-between items-start gap-y-4 shrink-0 pt-4 border-t"
            :class="isDark ? 'border-stone-800' : 'border-stone-100'"
        >
            <div
                v-if="!config.hideNotes && (!readonly || config.notes)"
                class="w-full flex flex-col gap-y-1"
            >
                <span
                    class="font-bold uppercase text-[10px] opacity-40"
                    :class="isDark ? 'text-stone-400' : 'text-stone-500'"
                    >Note:</span
                >

                <component
                    :is="readonly ? 'p' : 'textarea'"
                    :value="config.notes"
                    @input="(e: any) => updateConfig('notes', e.target.value)"
                    placeholder="Add notes about this data..."
                    :rows="readonly ? undefined : 2"
                    class="w-full text-xs leading-relaxed italic bg-transparent border-none focus:ring-0 p-0 resize-none placeholder:text-stone-300 transition-opacity"
                    :class="isDark ? 'text-stone-400' : 'text-stone-500'"
                >
                    <template v-if="readonly">{{ config.notes }}</template>
                </component>
            </div>

            <div
                v-if="!config.hideSource"
                class="flex items-center w-full shrink-0"
            >
                <span
                    class="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 block mr-2"
                    :class="isDark ? 'text-stone-400' : 'text-stone-500'"
                    >Source</span
                >

                <component
                    :is="readonly ? 'span' : 'input'"
                    :value="config.source"
                    @input="(e: any) => updateConfig('source', e.target.value)"
                    placeholder="Data source..."
                    class="flex-1 text-[10px] font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-stone-300"
                    :class="isDark ? 'text-indigo-400' : 'text-indigo-600'"
                >
                    <template v-if="readonly">{{ config.source }}</template>
                </component>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Only apply hover placeholder logic if NOT readonly */
.group:not(.readonly):not(:hover) input::placeholder,
.group:not(.readonly):not(:hover) textarea::placeholder {
    color: transparent;
}

input:focus,
textarea:focus {
    outline: none;
}
/* Keeps placeholders hidden until the parent group is hovered */
.group:not(:hover) input::placeholder,
.group:not(:hover) textarea::placeholder {
    color: transparent;
}
</style>
