<script setup lang="ts">
import { PhTable, PhChartBar, PhPalette, PhGear } from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const tabs = [
    { id: "data", icon: PhTable, label: "Data" },
    { id: "type", icon: PhChartBar, label: "Chart" },
    { id: "brand", icon: PhPalette, label: "Brand" },
    { id: "settings", icon: PhGear, label: "Config" },
] as const;

const toggleTab = (id: string) => {
    emit("update:modelValue", props.modelValue === id ? null : id);
};
</script>

<template>
    <div class="fixed right-8 top-14 bottom-8 z-60 flex pointer-events-none">
        <Transition name="slide-panel-left">
            <aside
                v-if="modelValue"
                class="ml-4 w-[320px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06)] rounded-2xl flex flex-col overflow-hidden pointer-events-auto"
            >
                <div
                    class="py-2 px-4 border-b border-stone-50 flex justify-between items-center shrink-0"
                >
                    <h3
                        class="text-base font-semibold text-stone-950 capitalize"
                    >
                        {{ modelValue }} Editor
                    </h3>
                    <button
                        @click="emit('update:modelValue', null)"
                        class="size-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition text-stone-400"
                    >
                        ✕
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar">
                    <slot :name="modelValue"></slot>
                </div>
            </aside>
        </Transition>
        <div
            class="self-center flex flex-col gap-y-2 shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06)] rounded-2xl bg-white p-1 pointer-events-auto"
        >
            <div
                v-for="tab in tabs"
                :key="tab.id"
                @click="toggleTab(tab.id)"
                :class="[
                    'flex flex-col justify-center items-center size-12 shrink-0 rounded-xl cursor-pointer transition-colors ease-in duration-150',
                    modelValue === tab.id
                        ? 'bg-stone-100 text-indigo-600'
                        : 'text-stone-900 hover:bg-stone-100',
                ]"
            >
                <component :is="tab.icon" class="size-6" />
                <span class="text-[10px] font-medium">{{ tab.label }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Flip the entry direction: slides from right to left */
.slide-panel-left-enter-active,
.slide-panel-left-leave-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-panel-left-enter-from,
.slide-panel-left-leave-to {
    transform: translateX(20px) scale(0.95);
    opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e4e2;
    border-radius: 10px;
}
</style>
