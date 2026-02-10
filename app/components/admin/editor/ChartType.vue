<script setup lang="ts">
const props = defineProps<{
    modelValue: any; // This is activeChart.config
    activeChart: any; // This is the full activeChart object
}>();

const emit = defineEmits(["update:modelValue", "update-type"]);

// When the type changes, we tell the parent (the page) to update the chart's type
const handleTypeChange = (newType: string) => {
    emit("update-type", { type: newType });
};

// When config settings change (smooth, stack, etc)
const handleConfigUpdate = (newConfig: any) => {
    emit("update:modelValue", newConfig);
};
</script>

<template>
    <div class="bg-white p-2 rounded-3xl space-y-2">
        <ChartTypeSelector
            :current-type="activeChart.type"
            @change-type="handleTypeChange"
        />

        <LayoutSettings
            :model-value="modelValue"
            @update:model-value="handleConfigUpdate"
        />

        <ComboChartSettings
            v-if="activeChart"
            :model-value="modelValue"
            :chart-data="activeChart"
            @update:model-value="handleConfigUpdate"
        />
    </div>
</template>
