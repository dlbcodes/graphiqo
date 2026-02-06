<script setup lang="ts">
import * as echarts from "echarts";

const props = defineProps<{
    options: any;
}>();

const chartRef = ref<HTMLElement | null>(null);
// Use shallowRef to prevent Vue from proxying the ECharts instance
const chartInstance = shallowRef<echarts.ECharts | null>(null);

// Watch for option changes
watch(
    () => props.options,
    (newOptions) => {
        if (chartInstance.value && newOptions) {
            // The fix: Use nextTick and try/catch to prevent "main process" error
            nextTick(() => {
                try {
                    // 'notMerge: true' is important when changing palettes/types
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
        if (props.options) {
            chartInstance.value.setOption(props.options);
        }

        // Handle window resizing
        window.addEventListener("resize", () => chartInstance.value?.resize());
    }
});

onUnmounted(() => {
    chartInstance.value?.dispose();
});
</script>

<template>
    <div ref="chartRef" class="w-full h-full min-h-[400px]"></div>
</template>
