<script setup lang="ts">
import { PhArrowsHorizontal } from "@phosphor-icons/vue";

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const updateValue = (key: string, val: any) => {
    config.value = { ...config.value, [key]: val };
};
</script>

<template>
    <Disclosure label="X Axis Settings">
        <template #icon>
            <PhArrowsHorizontal class="size-4 text-stone-500" />
        </template>

        <div class="space-y-4 pt-2">
            <Switch
                :model-value="!config.hideX"
                @update:model-value="(val) => updateValue('hideX', !val)"
            >
                <span class="ml-3 font-medium text-stone-700">Show X Axis</span>
            </Switch>

            <Switch
                :model-value="config.horizontal"
                @update:model-value="(val) => updateValue('horizontal', val)"
            >
                <span class="ml-3 font-medium text-stone-700"
                    >Swap to Horizontal</span
                >
            </Switch>
        </div>
    </Disclosure>
</template>
