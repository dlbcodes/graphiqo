<script setup lang="ts">
import {
    PhArrowsHorizontal,
    PhArrowsVertical,
    PhListBullets,
} from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

// Shared emission helper
const updateConfig = (newValue: any) => {
    emit("update:modelValue", newValue);
};
</script>

<template>
    <div class="flex flex-col gap-1">
        <XAxisSettings
            :model-value="modelValue"
            @update:model-value="updateConfig"
        />

        <YAxisSettings
            :model-value="modelValue"
            @update:model-value="updateConfig"
        />

        <LegendSettings
            :model-value="modelValue"
            @update:model-value="updateConfig"
        />
    </div>
</template>
