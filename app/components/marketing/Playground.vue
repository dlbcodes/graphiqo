<script setup lang="ts">
import {
    PhMagicWand,
    PhArrowRight,
    PhRocketLaunch,
    PhTrendUp,
    PhChartPieSlice,
    PhMoon,
    PhBriefcase,
    PhLightning,
} from "@phosphor-icons/vue";
import { PRESETS, DEMO_CHART_DATA } from "~/config/demo-presets";

const { formatOptions } = useChartFormatter();
const activePreset = ref(PRESETS[0]);

// Fix: Define iconMap in the script so it's available to the template
const iconMap = {
    PhRocketLaunch,
    PhTrendUp,
    PhChartPieSlice,
    PhMoon,
    PhBriefcase,
    PhLightning,
};

const mergedChartData = computed(() => ({
    ...DEMO_CHART_DATA,
    ...activePreset.value, // This brings in rawData and preset config
    config: {
        ...DEMO_CHART_DATA.config,
        ...activePreset.value.config,
    },
}));

// This matches your public page logic perfectly
const formattedOptions = computed(() => {
    return formatOptions(mergedChartData.value, null);
});
</script>

<template>
    <section class="py-20 bg-white overflow-hidden border-b border-stone-100">
        <div class="max-w-6xl w-full mx-auto px-6">
            <div class="flex flex-col items-center">
                <div class="flex flex-col mb-12">
                    <div
                        class="flex justify-center items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4"
                    >
                        <PhMagicWand class="size-4" />
                        Interactive Demo
                    </div>
                    <h1
                        class="text-center text-xl md:text-2xl lg:text-3xl font-semibold mb-10"
                    >
                        Data visualization reimagined for speed.
                    </h1>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6">
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
                                class="size-12 rounded-xl bg-white shadow-sm border border-stone-100 flex items-center justify-center shrink-0"
                            >
                                <component
                                    :is="
                                        iconMap[
                                            preset.icon as keyof typeof iconMap
                                        ]
                                    "
                                    class="size-6 text-stone-600"
                                />
                            </div>
                            <div>
                                <h3
                                    class="font-bold text-sm text-stone-900 leading-tight"
                                >
                                    {{ preset.label }}
                                </h3>
                                <p
                                    class="text-[10px] text-stone-500 mt-0.5 leading-tight"
                                >
                                    {{ preset.description }}
                                </p>
                            </div>
                        </button>
                    </div>

                    <Button to="/waitlist">
                        Create your first chart
                        <AnimatedArrow />
                    </Button>
                </div>

                <div class="relative w-full">
                    <div
                        class="w-full h-full max-w-6xl rounded-4xl p-10 transition-all duration-700 relative flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                        :class="
                            activePreset?.config.darkMode
                                ? 'bg-[#0f0f0f] '
                                : 'bg-white '
                        "
                    >
                        <ChartPreview
                            :chart-data="mergedChartData"
                            :options="formattedOptions"
                            readonly
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
