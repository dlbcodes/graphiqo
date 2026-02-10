<script setup lang="ts">
import { computed } from "vue";
import { PhTextT } from "@phosphor-icons/vue";

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

const fontOptions = [
    { label: "Geist (Modern)", value: "Geist" },
    { label: "Inter (Standard)", value: "Inter" },
    { label: "Geist Mono (Technical)", value: "Geist Mono" },
    { label: "Playfair Display", value: "Playfair Display" },
];

const sizeOptions = [
    { label: "10px - Small", value: "10" },
    { label: "12px - Medium", value: "12" },
    { label: "14px - Large", value: "14" },
    { label: "18px - X-Large", value: "18" },
];
</script>

<template>
    <Disclosure label="Typography & Text">
        <template #icon>
            <PhTextT class="size-4 text-stone-500" />
        </template>

        <div class="space-y-4 pt-2">
            <Field id="font-family" label="Font Family">
                <Listbox
                    :model-value="config.fontFamily || 'Geist'"
                    :options="fontOptions"
                    @update:model-value="
                        (val) => updateValue('fontFamily', val)
                    "
                />
            </Field>

            <Field id="font-size" label="Base Font Size">
                <Listbox
                    :model-value="String(config.fontSize || 12)"
                    :options="sizeOptions"
                    @update:model-value="
                        (val) => updateValue('fontSize', Number(val))
                    "
                />
            </Field>
        </div>
    </Disclosure>
</template>
