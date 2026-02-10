<script setup lang="ts">
import { CHART_PALETTES } from "@/utils/chartConstants";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const brandStore = useBrandStore();
const palettes = CHART_PALETTES;

const updateColumnType = (colKey: string, type: string) => {
    const currentTypes = props.modelValue.columnTypes || {};
    updateConfig("columnTypes", { ...currentTypes, [colKey]: type });
};

const updateConfig = (key: string, value: any) => {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const updateBrandLink = (brandId: string) => {
    updateConfig("brandProfileId", brandId);
};
</script>

<template>
    <div class="bg-white p-2 rounded-3xl overflow-y-auto custom-scrollbar">
        <ColorSelector
            :model-value="modelValue"
            @update:model-value="
                (newValue) => emit('update:modelValue', newValue)
            "
        />

        <GoalSettings
            :model-value="modelValue"
            @update:model-value="
                (newValue) => emit('update:modelValue', newValue)
            "
        />

        <TextSettings
            :model-value="modelValue"
            @update:model-value="
                (newValue) => emit('update:modelValue', newValue)
            "
        />

        <LayoutSettings
            :model-value="modelValue"
            @update:model-value="
                (newValue) => emit('update:modelValue', newValue)
            "
        />

        <LegendSettings
            :model-value="modelValue"
            @update:model-value="
                (newValue) => emit('update:modelValue', newValue)
            "
        />

        <XAxisSettings
            :model-value="modelValue"
            @update:model-value="
                (newValue) => emit('update:modelValue', newValue)
            "
        />

        <YAxisSettings
            :model-value="modelValue"
            @update:model-value="
                (newValue) => emit('update:modelValue', newValue)
            "
        />

        <ComboChartSettings
            :model-value="modelValue"
            @update:model-value="
                (newValue) => emit('update:modelValue', newValue)
            "
        />
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
}
</style>
