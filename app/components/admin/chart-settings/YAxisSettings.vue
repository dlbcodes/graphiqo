<script setup lang="ts">
import { PhArrowsVertical } from "@phosphor-icons/vue";

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const updateValue = (key: string, val: any) => {
    config.value = { ...config.value, [key]: val };
};

const precisionOptions = [
    { label: "0 (Whole)", value: "0" },
    { label: "0.1 (Dec)", value: "1" },
    { label: "0.01 (Cents)", value: "2" },
];
</script>

<template>
    <Disclosure label="Y Axis Settings">
        <template #icon>
            <PhArrowsVertical class="size-4 text-stone-500" />
        </template>

        <div class="space-y-4 pt-2">
            <Switch
                :model-value="!config.hideY"
                @update:model-value="(val) => updateValue('hideY', !val)"
            >
                <span class="ml-3 font-medium text-stone-700">Show Y Axis</span>
            </Switch>

            <Switch
                :model-value="config.showGrid"
                @update:model-value="(val) => updateValue('showGrid', val)"
            >
                <span class="ml-3 font-medium text-stone-700"
                    >Show Grid Lines</span
                >
            </Switch>
        </div>
    </Disclosure>
</template>
