<script setup lang="ts">
import * as echarts from "echarts";

const props = defineProps<{
    options: any;
    chartData: any;
}>();

const emit = defineEmits(["updateMetadata"]);

const chartRef = ref<HTMLElement | null>(null);
const chartInstance = shallowRef<echarts.ECharts | null>(null);

const config = computed(() => props.chartData?.config || {});
const isDark = computed(() => config.value.darkMode);

// Local temporary name to handle input before sync
const localName = ref(props.chartData?.name);
watch(
    () => props.chartData?.name,
    (newVal) => (localName.value = newVal),
);

// Helper to update config fields
const updateConfig = (key: string, value: string) => {
    emit("updateMetadata", { config: { ...config.value, [key]: value } });
};

// --- ECHARTS LOGIC ---
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
        chartInstance.value = echarts.init(chartRef.value);
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
    <div class="h-full w-full flex flex-col font-sans group">
        <div class="mb-6 shrink-0 text-left space-y-0">
            <input
                v-model="localName"
                @blur="$emit('updateMetadata', { name: localName })"
                placeholder="Chart Title..."
                class="w-full text-lg font-semibold tracking-tight bg-transparent border-none focus:ring-0 p-0 placeholder:text-stone-300 transition-colors"
                :class="isDark ? 'text-white' : 'text-stone-900'"
            />
            <input
                :value="config.subtitle"
                @input="
                    (e) =>
                        updateConfig(
                            'subtitle',
                            (e.target as HTMLInputElement).value,
                        )
                "
                placeholder="Add a subtitle..."
                class="w-full text-sm font-medium bg-transparent border-none focus:ring-0 p-0 opacity-60 placeholder:text-stone-300"
                :class="isDark ? 'text-stone-400' : 'text-stone-500'"
            />
        </div>

        <div class="flex-1 min-h-[400px] relative">
            <div ref="chartRef" class="absolute inset-0 w-full h-full"></div>
        </div>

        <div
            class="flex flex-col justify-between items-start gap-y-2 shrink-0"
            :class="isDark ? 'border-stone-800' : 'border-stone-200'"
        >
            <div class="w-full flex flex-col gap-y-1">
                <span
                    class="font-bold uppercase text-xs mt-1 opacity-40"
                    :class="isDark ? 'text-stone-400' : 'text-stone-500'"
                    >Note:</span
                >
                <textarea
                    :value="config.notes"
                    @input="
                        (e) =>
                            updateConfig(
                                'notes',
                                (e.target as HTMLTextAreaElement).value,
                            )
                    "
                    placeholder="Add notes about this data..."
                    rows="2"
                    class="w-full text-xs leading-relaxed italic bg-transparent border-none focus:ring-0 p-0 resize-none placeholder:text-stone-300 transition-opacity"
                    :class="isDark ? 'text-stone-400' : 'text-stone-500'"
                ></textarea>
            </div>

            <div class="flex items-center w-full text-right shrink-0">
                <span
                    class="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 block"
                    >Source</span
                >
                <input
                    :value="config.source"
                    @input="
                        (e) =>
                            updateConfig(
                                'source',
                                (e.target as HTMLInputElement).value,
                            )
                    "
                    placeholder="Data source..."
                    class="flex-1 w-full text-[10px] font-bold bg-transparent border-none focus:ring-0 p-0 text-left placeholder:text-stone-300"
                    :class="isDark ? 'text-indigo-400' : 'text-indigo-600'"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Focus state: give the user a tiny visual hint they are editing */
input:focus,
textarea:focus {
    outline: none;
}
/* Hide placeholders when not hovered to keep it clean */
.group:not(:hover) input::placeholder,
.group:not(:hover) textarea::placeholder {
    color: transparent;
}
</style>
