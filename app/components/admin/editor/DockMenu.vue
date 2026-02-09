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
    <div class="fixed left-8 top-8 bottom-8 z-60 flex pointer-events-none">
        <div
            class="self-center flex flex-col gap-y-2 shadow-sm rounded-2xl bg-white p-1 border border-stone-200 pointer-events-auto"
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

        <Transition name="slide-panel">
            <aside
                v-if="modelValue"
                class="ml-4 w-[320px] bg-white shadow-2xl rounded-[2.5rem] border border-stone-200 flex flex-col overflow-hidden pointer-events-auto"
            >
                <div
                    class="p-6 border-b border-stone-50 flex justify-between items-center shrink-0"
                >
                    <h3
                        class="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400"
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
    </div>
</template>

<style scoped>
.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(-20px) scale(0.95);
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
