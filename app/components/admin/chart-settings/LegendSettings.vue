<script setup lang="ts">
import { PhMegaphone } from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const updateValue = (key: string, val: any) => {
    config.value = { ...config.value, [key]: val };
};

const positionOptions = [
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Left Side", value: "left" },
    { label: "Right Side", value: "right" },
];
</script>

<template>
    <Disclosure label="Legend Settings">
        <template #icon>
            <PhMegaphone class="size-4 text-stone-500" />
        </template>

        <div class="space-y-4 pt-2">
            <Switch
                :model-value="config.showLegend !== false"
                @update:model-value="(val) => updateValue('showLegend', val)"
            >
                <span class="ml-3 font-medium text-stone-700"
                    >Display Legend</span
                >
            </Switch>

            <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-1 opacity-0"
            >
                <div v-if="config.showLegend !== false" class="pt-2">
                    <Field id="legend-position" label="Position">
                        <Listbox
                            :model-value="config.legendPosition || 'bottom'"
                            :options="positionOptions"
                            @update:model-value="
                                (val) => updateValue('legendPosition', val)
                            "
                        />
                    </Field>
                </div>
            </transition>
        </div>
    </Disclosure>
</template>
