<script setup lang="ts">
import { PhListBullets, PhHash, PhLayout } from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

// Available modes for the legend values
const modes = [
    { label: "None", value: "none" },
    { label: "Last", value: "last" },
    { label: "Avg", value: "avg" },
    { label: "Sum", value: "sum" },
] as const;

const updateLegend = (key: string, value: any) => {
    const currentLegend = props.modelValue.legend || {};
    emit("update:modelValue", {
        ...props.modelValue,
        legend: {
            ...currentLegend,
            [key]: value,
        },
    });
};
</script>

<template>
    <Disclosure label="Legend">
        <template #icon><PhListBullets class="size-4 text-stone-500" /></template>
        
        <div class="space-y-4 pt-2">
            <div class="flex items-center justify-between px-1">
                <span class="text-xs font-semibold text-stone-700">Show Legend</span>
                <Switch 
                    :model-value="modelValue.legend?.show ?? true" 
                    @update:model-value="(val) => updateLegend('show', val)" 
                />
            </div>

            <hr class="border-stone-50" />

            <div class="space-y-2">
                <div class="flex items-center gap-2 px-1 text-stone-400">
                    <PhHash class="size-3" />
                    <span class="text-[10px] font-black uppercase tracking-widest">Display Value</span>
                </div>
                
                <div class="grid grid-cols-4 gap-1 bg-stone-100 p-1 rounded-xl">
                    <button
                        v-for="mode in modes"
                        :key="mode.value"
                        @click="updateLegend('valueMode', mode.value)"
                        :class="[
                            'py-1.5 text-[10px] font-bold rounded-lg transition-all',
                            (modelValue.legend?.valueMode || 'none') === mode.value
                                ? 'bg-white text-stone-900 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'
                        ]"
                    >
                        {{ mode.label }}
                    </button>
                </div>
            </div>

            <div class="space-y-2">
                <div class="flex items-center gap-2 px-1 text-stone-400">
                    <PhLayout class="size-3" />
                    <span class="text-[10px] font-black uppercase tracking-widest">Position</span>
                </div>
                <div class="flex gap-2 bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <button 
                        v-for="pos in ['top', 'bottom']" 
                        :key="pos"
                        @click="updateLegend('position', pos)"
                        :class="[
                            'flex-1 py-1 text-[10px] font-black uppercase rounded-md transition-all border',
                            (modelValue.legend?.position || 'top') === pos
                                ? 'bg-stone-900 border-stone-900 text-white'
                                : 'bg-white border-stone-200 text-stone-400'
                        ]"
                    >
                        {{ pos }}
                    </button>
                </div>
            </div>
        </div>
    </Disclosure>
</template>