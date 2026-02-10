<script setup lang="ts">
import { computed } from "vue";
import { PhLayout } from "@phosphor-icons/vue";

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

const precisionOptions = [
    { label: "0 (Whole)", value: "0" },
    { label: "0.1 (Decimals)", value: "1" },
    { label: "0.01 (Cents)", value: "2" },
];
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
                    class="flex justify-between"
                >
                    Smooth Curves
                </Switch>

                <Switch
                    :model-value="config.area"
                    @update:model-value="(val) => updateValue('area', val)"
                    class="flex justify-between"
                >
                    Fill Background
                </Switch>
            </div>

            <hr class="border-stone-100" />

            <div class="space-y-3">
                <Switch
                    :model-value="config.stack"
                    @update:model-value="(val) => updateValue('stack', val)"
                    class="flex justify-between"
                >
                    Stack Series
                </Switch>

                <Switch
                    :model-value="config.horizontal"
                    @update:model-value="
                        (val) => updateValue('horizontal', val)
                    "
                    class="flex justify-between"
                >
                    Horizontal Layout
                </Switch>
            </div>

            <hr class="border-stone-100" />

            <div class="space-y-4">
                <h4
                    class="text-[10px] font-black text-stone-400 uppercase tracking-widest"
                >
                    Number Formatting
                </h4>

                <div class="grid grid-cols-2 gap-3">
                    <Field id="suffix" label="Suffix">
                        <Input
                            size="sm"
                            placeholder="%, $, etc"
                            :model-value="config.suffix"
                            @update:model-value="
                                (val) => updateValue('suffix', val)
                            "
                        />
                    </Field>

                    <Field id="precision" label="Precision">
                        <Listbox
                            :model-value="String(config.precision || 0)"
                            :options="precisionOptions"
                            @update:model-value="
                                (val) => updateValue('precision', Number(val))
                            "
                        />
                    </Field>
                </div>
            </div>

            <hr class="border-stone-100" />

            <div class="space-y-5 pb-2">
                <div class="space-y-2">
                    <div class="flex justify-between items-end">
                        <label
                            class="text-[10px] font-black text-stone-400 uppercase tracking-widest"
                            >Line Weight</label
                        >
                        <span
                            class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"
                            >{{ config.lineWidth || 2 }}px</span
                        >
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        :value="config.lineWidth || 2"
                        @input="
                            (e) =>
                                updateValue(
                                    'lineWidth',
                                    Number(
                                        (e.target as HTMLInputElement).value,
                                    ),
                                )
                        "
                        class="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-end">
                        <label
                            class="text-[10px] font-black text-stone-400 uppercase tracking-widest"
                            >Dot Size</label
                        >
                        <span
                            class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"
                            >{{ config.symbolSize ?? 4 }}px</span
                        >
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="12"
                        step="1"
                        :value="config.symbolSize ?? 4"
                        @input="
                            (e) =>
                                updateValue(
                                    'symbolSize',
                                    Number(
                                        (e.target as HTMLInputElement).value,
                                    ),
                                )
                        "
                        class="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
            </div>
        </div>
    </Disclosure>
</template>
