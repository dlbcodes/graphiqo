<script setup lang="ts">
import {
    PhSlideshow,
    PhEnvelope,
    PhLinkedinLogo,
    PhInstagramLogo,
    PhTiktokLogo,
    PhTwitterLogo,
    PhDeviceMobile,
    PhImage,
} from "@phosphor-icons/vue";
import ChartPreview from "@/components/admin/editor/ChartPreview.vue";
import { useChartDownload } from "~/composables/useChartDownload";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

const store = useDashboardStore();
const { downloadWithPreset, isDownloading } = useChartDownload();

// 1. Social Presets
const exportSizes = [
    {
        id: "slides",
        label: "Google Slides",
        ratio: "16/9",
        w: 1920,
        h: 1080,
        icon: PhSlideshow,
    },
    {
        id: "web",
        label: "Web/Mail",
        ratio: "3/2",
        w: 1200,
        h: 800,
        icon: PhEnvelope,
    },
    {
        id: "li",
        label: "LinkedIn",
        ratio: "1.91/1",
        w: 1200,
        h: 627,
        icon: PhLinkedinLogo,
    },
    {
        id: "ig-sq",
        label: "Instagram",
        ratio: "1/1",
        w: 1080,
        h: 1080,
        icon: PhInstagramLogo,
    },
    {
        id: "tiktok",
        label: "TikTok Post",
        ratio: "9/16",
        w: 1080,
        h: 1920,
        icon: PhTiktokLogo,
    },
    {
        id: "ig-post",
        label: "Instagram Post",
        ratio: "9/16",
        w: 1080,
        h: 1920,
        icon: PhInstagramLogo,
    },
    {
        id: "tw",
        label: "X / Twitter",
        ratio: "16/9",
        w: 1600,
        h: 900,
        icon: PhTwitterLogo,
    },
    {
        id: "mobile",
        label: "Mobile",
        ratio: "9/16",
        w: 1080,
        h: 1920,
        icon: PhDeviceMobile,
    },
];

const selectedSize = ref(exportSizes[0]);

// 2. Computed Data
const activeChart = computed(() =>
    store.currentDashboard?.charts.find((c) => c.id === store.activeChartId),
);

const { formatOptions } = useChartFormatter();
const brandStore = useBrandStore();

const chartOptions = computed(() => {
    const brandId = activeChart.value?.config?.brandProfileId;
    const brand = brandId
        ? brandStore.brands.find((b) => b.id === brandId)
        : null;
    return formatOptions(activeChart.value, brand);
});

// 3. Export Logic - Pass options and data to composable
const handleDownload = async () => {
    if (!activeChart.value) return;

    await downloadWithPreset(
        "export-preview-container",
        {
            w: selectedSize.value.w,
            h: selectedSize.value.h,
            id: selectedSize.value.id,
        },
        chartOptions.value,
        activeChart.value,
        `${activeChart.value.name}-${selectedSize.value.id}.png`,
    );
};
</script>

<template>
    <Modal
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        size="4xl"
        class="max-w-4xl"
    >
        <div class="flex h-[650px] overflow-hidden bg-white rounded-xl">
            <div
                class="flex-1 bg-stone-100 p-12 flex items-center justify-center min-h-0 border-r border-stone-200"
            >
                <div
                    class="relative shadow-2xl bg-white transition-all duration-300 ease-in-out overflow-hidden"
                    :style="{
                        aspectRatio: selectedSize.ratio,
                        maxHeight: '100%',
                        maxWidth: '100%',
                    }"
                >
                    <div
                        id="export-preview-container"
                        class="w-full h-full p-10 flex flex-col"
                        :class="activeChart?.config?.darkMode ? 'bg-[#0F0F0F]' : 'bg-white'"
                    >
                        <div class="mb-4">
                            <h4 
                                class="text-xl font-bold"
                                :class="activeChart?.config?.darkMode ? 'text-white' : 'text-stone-900'"
                            >
                                {{ activeChart?.name }}
                            </h4>
                            <p 
                                v-if="activeChart?.config?.subtitle"
                                class="text-sm mt-1 opacity-80"
                                :class="activeChart?.config?.darkMode ? 'text-stone-400' : 'text-stone-600'"
                            >
                                {{ activeChart?.config?.subtitle }}
                            </p>
                        </div>

                        <div class="flex-1 w-full h-full relative min-h-0">
                            <ChartPreview
                                v-if="activeChart"
                                :key="selectedSize.id"
                                :options="chartOptions"
                                :chart-data="activeChart"
                                class="absolute inset-0 w-full h-full"
                            />
                        </div>

                        <div 
                            class="mt-6 pt-4 flex items-center justify-between border-t"
                            :class="activeChart?.config?.darkMode ? 'border-stone-800' : 'border-stone-200'"
                        >
                            <p 
                                v-if="activeChart?.config?.notes"
                                class="text-[11px] italic"
                                :class="activeChart?.config?.darkMode ? 'text-stone-400' : 'text-stone-500'"
                            >
                                {{ activeChart?.config?.notes }}
                            </p>
                            <p 
                                v-if="activeChart?.config?.source"
                                class="text-[11px] font-semibold"
                                :class="activeChart?.config?.darkMode ? 'text-indigo-400' : 'text-indigo-600'"
                            >
                                Source: {{ activeChart?.config?.source }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="w-85 p-6 flex flex-col gap-6 overflow-y-auto bg-white shrink-0"
            >
                <div>
                    <h3 class="text-lg font-bold text-stone-900 tracking-tight">
                        Export Image
                    </h3>
                    <p class="text-xs text-stone-500 mt-1">
                        Select a format. Your chart will automatically adjust
                        its layout.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-2">
                    <button
                        v-for="size in exportSizes"
                        :key="size.id"
                        @click="selectedSize = size"
                        :class="[
                            'flex items-center justify-between p-3.5 rounded-xl border text-left transition-all group',
                            selectedSize.id === size.id
                                ? 'border-stone-950 bg-stone-950 text-white shadow-lg shadow-stone-200'
                                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400',
                        ]"
                    >
                        <div class="flex items-center gap-3">
                            <component
                                :is="size.icon"
                                class="size-5 shrink-0"
                            />
                            <div>
                                <p class="text-[11px] font-bold tracking-tight">
                                    {{ size.label }}
                                </p>
                                <p class="text-[9px] opacity-60 font-medium">
                                    {{ size.ratio }} ratio
                                </p>
                            </div>
                        </div>
                        <div
                            v-if="selectedSize.id === size.id"
                            class="size-1.5 rounded-full bg-white"
                        />
                    </button>
                </div>
            </div>
        </div>

        <template #footer="{ close }">
            <div class="flex items-center justify-between w-full">
                <p class="text-[11px] text-stone-400">
                    High-quality 2x resolution export
                </p>
                <div class="flex items-center gap-3">
                    <Button variant="secondary" @click="close" class="h-10 px-6"
                        >Cancel</Button
                    >
                    <Button
                        :loading="isDownloading"
                        @click="handleDownload"
                        class="h-10 px-6 bg-stone-950 hover:bg-stone-800"
                    >
                        <PhImage class="size-4 mr-2" weight="bold" />
                        Download PNG
                    </Button>
                </div>
            </div>
        </template>
    </Modal>
</template>