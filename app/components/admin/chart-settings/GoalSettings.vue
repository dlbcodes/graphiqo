<script setup lang="ts">
import { computed } from "vue";
import { PhTarget } from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

// Writable computed to handle state changes safely
const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const updateValue = (key: string, val: any) => {
    config.value = { ...config.value, [key]: val };
};
</script>

<template>
    <section class="bg-rose-50 p-4 rounded-2xl border border-rose-100">
        <header class="flex items-center gap-2 mb-3">
            <PhTarget class="size-3 text-rose-400" weight="fill" />
            <h4
                class="text-[10px] font-black text-rose-400 uppercase tracking-widest"
            >
                Goal / Target Line
            </h4>
        </header>

        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="text-[9px] text-rose-600 font-bold mb-1 block"
                    >Value</label
                >
                <input
                    type="number"
                    :value="config.goalValue"
                    @input="
                        (e) =>
                            updateValue(
                                'goalValue',
                                Number((e.target as HTMLInputElement).value),
                            )
                    "
                    class="w-full text-xs p-2 bg-white rounded-lg border-none focus:ring-2 focus:ring-rose-500 placeholder:text-rose-200 text-rose-900"
                    placeholder="e.g. 100"
                />
            </div>
            <div>
                <label class="text-[9px] text-rose-600 font-bold mb-1 block"
                    >Label</label
                >
                <input
                    :value="config.goalLabel"
                    @input="
                        (e) =>
                            updateValue(
                                'goalLabel',
                                (e.target as HTMLInputElement).value,
                            )
                    "
                    class="w-full text-xs p-2 bg-white rounded-lg border-none focus:ring-2 focus:ring-rose-500 placeholder:text-rose-200 text-rose-900"
                    placeholder="Target"
                />
            </div>
        </div>
    </section>
</template>
