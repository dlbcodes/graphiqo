<script setup lang="ts">
import {
    PhMagicWand,
    PhArrowRight,
    PhMoon,
    PhBriefcase,
    PhLightning,
} from "@phosphor-icons/vue";
import { PRESETS, DEMO_CHART_DATA } from "~/config/demo-presets";

const activePreset = ref(PRESETS[0]);

// Icon Mapper for Dynamic Components
const iconMap: Record<string, any> = {
    PhMoon,
    PhBriefcase,
    PhLightning,
};

// Merges the demo metadata with the active preset's style configuration
const mergedChartData = computed(() => ({
    ...DEMO_CHART_DATA,
    config: { ...DEMO_CHART_DATA.config, ...activePreset.value?.config },
}));
</script>

<template>
    <section class="py-24 bg-white overflow-hidden border-b border-stone-100">
        <div class="max-w-6xl w-full mx-auto px-6">
            <div class="flex flex-col items-center">
                <div class="flex flex-col">
                    <div
                        class="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4"
                    >
                        <PhMagicWand class="size-4" />
                        Interactive Demo
                    </div>
                    <h1
                        class="flex justify-center text-center text-xl md:text-2xl lg:text-3xl font-semibold"
                    >
                        Data visualization reimagined for speed.
                    </h1>

                    <div class="grid grid-cols-3 gap-4 mt-12">
                        <button
                            v-for="preset in PRESETS"
                            :key="preset.id"
                            @click="activePreset = preset"
                            class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
                            :class="
                                activePreset?.id === preset.id
                                    ? 'border-indigo-600 bg-indigo-50/30'
                                    : 'border-stone-100 hover:border-stone-200'
                            "
                        >
                            <div
                                class="size-12 rounded-xl bg-white shadow-sm border border-stone-100 flex items-center justify-center"
                            >
                                <component
                                    :is="iconMap[preset.icon]"
                                    class="size-6 text-stone-600"
                                />
                            </div>
                            <div>
                                <h3 class="font-bold text-stone-900">
                                    {{ preset.label }}
                                </h3>
                                <p class="text-xs text-stone-500">
                                    {{ preset.description }}
                                </p>
                            </div>
                        </button>
                    </div>

                    <NuxtLink
                        to="/editor"
                        class="mt-10 inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        Create your first chart
                        <PhArrowRight class="size-5" />
                    </NuxtLink>
                </div>

                <div class="relative w-full">
                    <div
                        class="w-full h-full max-w-6xl rounded-4xl p-10 transition-all duration-700 relative flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                        :class="
                            activePreset?.config.darkMode
                                ? 'bg-stone-900 shadow-black/20'
                                : 'bg-white shadow-stone-200'
                        "
                    >
                        <ChartPreview
                            :chart-data="mergedChartData"
                            :options="activePreset?.options"
                            readonly
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
