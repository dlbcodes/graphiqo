<script setup lang="ts">
import { computed } from "vue";
import { PhLayout, PhGraph, PhChartBar } from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const updateValue = (key: string, val: boolean) => {
    config.value = { ...config.value, [key]: val };
};
</script>

<template>
    <Disclosure label="Layout & Logic">
        <template #icon>
            <PhLayout class="size-4 text-stone-500" />
        </template>

        <div class="space-y-4 pt-2">
            <div class="space-y-3">
                <Switch
                    :model-value="config.smooth"
                    @update:model-value="(val) => updateValue('smooth', val)"
                >
                    <span class="ml-3 font-medium text-stone-700"
                        >Smooth Curves</span
                    >
                </Switch>

                <Switch
                    :model-value="config.area"
                    @update:model-value="(val) => updateValue('area', val)"
                >
                    <span class="ml-3 font-medium text-stone-700"
                        >Fill Background</span
                    >
                </Switch>
            </div>

            <hr class="border-stone-100" />

            <div class="space-y-3">
                <Switch
                    :model-value="config.showGrid"
                    @update:model-value="(val) => updateValue('showGrid', val)"
                >
                    <span class="ml-3 font-medium text-stone-700"
                        >Show Grid Lines</span
                    >
                </Switch>

                <Switch
                    :model-value="config.showLabels"
                    @update:model-value="
                        (val) => updateValue('showLabels', val)
                    "
                >
                    <span class="ml-3 font-medium text-stone-700"
                        >Show Data Labels</span
                    >
                </Switch>
            </div>

            <hr class="border-stone-100" />

            <div class="space-y-3">
                <Switch
                    :model-value="config.stack"
                    @update:model-value="(val) => updateValue('stack', val)"
                >
                    <span class="ml-3 font-medium text-stone-700"
                        >Stack Series</span
                    >
                </Switch>

                <Switch
                    :model-value="config.horizontal"
                    @update:model-value="
                        (val) => updateValue('horizontal', val)
                    "
                >
                    <span class="ml-3 font-medium text-stone-700"
                        >Horizontal Layout</span
                    >
                </Switch>
            </div>
        </div>
    </Disclosure>
</template>
