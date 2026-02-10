<script setup lang="ts">
import { computed } from "vue";
import { PhMagicWand } from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: any;
    // We pass the chart data so we know how many columns actually exist
    chartData: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

// Get the actual value columns from the data (excluding the category/label column)
const dataColumns = computed(() => {
    if (!props.chartData?.rawData || props.chartData.rawData.length === 0)
        return [];
    // Assuming the first column is the label, and others are values
    const firstRow = props.chartData.rawData[0];
    return Object.keys(firstRow).filter((key, index) => index > 0);
});

const updateColumnType = (colKey: string, type: string) => {
    const currentTypes = { ...(config.value.columnTypes || {}) };
    currentTypes[colKey] = type;

    config.value = {
        ...config.value,
        columnTypes: currentTypes,
    };
};

const chartTypes = [
    { label: "bar", value: "bar" },
    { label: "line", value: "line" },
    { label: "scatter", value: "scatter" },
];
</script>

<template>
    <Disclosure label="Series Overrides (Mixed Mode)">
        <template #icon>
            <PhMagicWand class="size-4 text-stone-500" />
        </template>

        <div class="space-y-3 pt-2">
            <p class="text-[10px] text-stone-400 font-medium mb-4 italic">
                Override individual series types to create combo charts.
            </p>

            <div
                class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar"
            >
                <div
                    v-for="col in dataColumns"
                    :key="col"
                    class="flex items-center justify-between bg-stone-50 p-2 rounded-xl border border-stone-100"
                >
                    <span
                        class="text-[10px] font-bold text-stone-600 uppercase pl-1"
                    >
                        {{ col }}
                    </span>

                    <div
                        class="flex gap-1 bg-white p-1 rounded-lg border border-stone-100 shadow-sm"
                    >
                        <button
                            v-for="type in chartTypes"
                            :key="type.value"
                            @click="updateColumnType(col, type.value)"
                            :class="[
                                'px-2 py-1 text-[9px] rounded font-black uppercase transition-all',
                                config.columnTypes?.[col] === type.value
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50',
                            ]"
                        >
                            {{ type.label }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="dataColumns.length === 0" class="py-4 text-center">
                <span class="text-[10px] text-stone-400"
                    >No data series detected.</span
                >
            </div>
        </div>
    </Disclosure>
</template>
