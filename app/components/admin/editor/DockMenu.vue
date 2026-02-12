<script setup lang="ts">
import { ref } from "vue"; // [!code ++]
import { onClickOutside } from "@vueuse/core"; // [!code ++]
import {
    PhTable,
    PhChartBar,
    PhPalette,
    PhGear,
    PhX,
} from "@phosphor-icons/vue";
import { buttonVariants } from "~/variants/ButtonVariants";

const props = defineProps<{
    modelValue: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

// Refs for click-outside detection
const panelRef = ref(null); // [!code ++]
const navRef = ref(null); // [!code ++]

// Close the panel if clicking outside the aside AND the nav dock
onClickOutside(
    panelRef,
    () => {
        // [!code ++]
        if (props.modelValue) emit("update:modelValue", null); // [!code ++]
    },
    { ignore: [navRef] },
); // [!code ++]

const tabs = [
    { id: "data", icon: PhTable, label: "Data" },
    { id: "type", icon: PhChartBar, label: "Chart" },
    { id: "brand", icon: PhPalette, label: "Brand" },
    { id: "layout", icon: PhGear, label: "Layout" },
] as const;

const toggleTab = (id: string) => {
    emit("update:modelValue", props.modelValue === id ? null : id);
};
</script>

<template>
    <div
        class="fixed right-6 top-20 bottom-8 z-50 flex items-stretch gap-4 pointer-events-none"
    >
        <Transition name="slide-fade">
            <aside
                v-if="modelValue"
                ref="panelRef"
                class="w-84 h-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] rounded-4xl flex flex-col overflow-hidden pointer-events-auto border border-stone-200/60"
            >
                <div
                    class="h-16 px-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/40 shrink-0"
                >
                    <div class="flex flex-col">
                        <span
                            class="text-[10px] uppercase tracking-widest font-semibold text-stone-400"
                            >Editor</span
                        >
                        <h3
                            class="text-sm font-semibold text-stone-900 capitalize leading-none"
                        >
                            {{ modelValue }}
                        </h3>
                    </div>
                    <button
                        @click="emit('update:modelValue', null)"
                        :class="
                            cn(
                                buttonVariants({
                                    variant: 'icon',
                                    size: 'icon',
                                }),
                                'hover:bg-stone-200/50 rounded-full transition-colors',
                            )
                        "
                    >
                        <PhX class="size-4 text-stone-500" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto no-scrollbar p-1">
                    <slot :name="modelValue"></slot>
                </div>

                <div
                    class="h-10 border-t border-stone-50 flex items-center justify-center bg-stone-50/20 shrink-0"
                >
                    <LogoMono class="size-20 text-stone-300" />
                </div>
            </aside>
        </Transition>

        <nav
            ref="navRef"
            class="self-start flex flex-col gap-y-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.06),inset_0_0_0_1px_rgba(0,0,0,0.08)] rounded-3xl bg-white p-1.5 pointer-events-auto border border-white"
        >
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="toggleTab(tab.id)"
                :class="[
                    'relative flex flex-col justify-center items-center size-14 shrink-0 rounded-2xl transition-all duration-300 group',
                    modelValue === tab.id
                        ? 'bg-stone-900 text-white shadow-lg'
                        : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900',
                ]"
            >
                <component
                    :is="tab.icon"
                    class="size-5 mb-1"
                    :weight="modelValue === tab.id ? 'fill' : 'regular'"
                />
                <span class="text-[9px] font-bold uppercase tracking-tighter">{{
                    tab.label
                }}</span>
            </button>
        </nav>
    </div>
</template>

<style scoped>
/* Smooth slide and scale for a premium feel */
.slide-fade-enter-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.7, 0, 0.84, 0);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(40px) scale(0.95);
    opacity: 0;
    filter: blur(8px);
}

/* Ensure no scrollbar shows but scrolling still works */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
