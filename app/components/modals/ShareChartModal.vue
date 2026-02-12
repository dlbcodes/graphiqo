<script setup lang="ts">
import { ref, computed } from "vue";
import {
    PhShareNetwork,
    PhCopy,
    PhImage,
    PhGlobe,
    PhCheck,
    PhInstagramLogo,
    PhLinkedinLogo,
    PhTwitterLogo,
} from "@phosphor-icons/vue";
import { useClipboard } from "@vueuse/core";
import * as htmlToImage from "html-to-image";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);

const store = useDashboardStore();
const { addToast } = useToast();

const activeChart = computed(() =>
    store.currentDashboard?.charts.find((c) => c.id === store.activeChartId),
);

// --- 1. Link Sharing Logic ---
const publicUrl = computed(() =>
    typeof window !== "undefined"
        ? `${window.location.origin}/share/${activeChart.value?.id}`
        : "",
);
const { copy, copied } = useClipboard({ source: publicUrl });

const togglePublic = async (val: boolean) => {
    if (!activeChart.value) return;
    // We save this into the chart's config object in Prisma
    await store.updateChartData(activeChart.value.id, {
        config: { ...activeChart.value.config, isPublic: val },
    });
    addToast(val ? "Chart is now public" : "Chart is now private", {
        type: "info",
    });
};

// --- 2. Export Configuration ---
const exportSizes = [
    {
        id: "ig-sq",
        label: "Instagram Square",
        desc: "1080 x 1080",
        w: 1080,
        h: 1080,
        icon: PhInstagramLogo,
    },
    {
        id: "ig-story",
        label: "Story",
        desc: "1080 x 1920",
        w: 1080,
        h: 1920,
        icon: PhInstagramLogo,
    },
    {
        id: "li-post",
        label: "LinkedIn Post",
        desc: "1200 x 627",
        w: 1200,
        h: 627,
        icon: PhLinkedinLogo,
    },
    {
        id: "tw-post",
        label: "Twitter / X",
        desc: "1600 x 900",
        w: 1600,
        h: 900,
        icon: PhTwitterLogo,
    },
];

const selectedSize = ref(exportSizes[0]);
const isExporting = ref(false);

// --- 3. The Export Engine ---
const downloadImage = async () => {
    const node = document.getElementById("chart-canvas");
    if (!node) return addToast("Canvas not found", { type: "error" });

    isExporting.value = true;
    try {
        const dataUrl = await htmlToImage.toPng(node, {
            quality: 1,
            pixelRatio: 2, // Ensures 2x crispness
            width: selectedSize.value.w,
            height: selectedSize.value.h,
            backgroundColor: activeChart.value?.config?.darkMode
                ? "#0F0F0F"
                : "#FFFFFF",
        });

        const link = document.createElement("a");
        link.download = `chart-${selectedSize.value.id}.png`;
        link.href = dataUrl;
        link.click();

        addToast("Image downloaded!", { type: "success" });
    } catch (err) {
        addToast("Export failed", { type: "error" });
    } finally {
        isExporting.value = false;
    }
};
</script>

<template>
    <Modal
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <div class="p-6 flex flex-col gap-8">
            <div class="text-center">
                <h3 class="text-xl font-bold text-stone-900">Share & Export</h3>
                <p class="text-sm text-stone-500">
                    Publish your chart or export for social media.
                </p>
            </div>

            <div
                class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <PhGlobe class="size-4 text-stone-400" />
                        <span class="text-sm font-semibold text-stone-700"
                            >Public Link</span
                        >
                    </div>
                    <Switch
                        :model-value="activeChart?.config?.isPublic"
                        @update:model-value="togglePublic"
                    />
                </div>

                <div v-if="activeChart?.config?.isPublic" class="flex gap-2">
                    <input
                        readonly
                        :value="publicUrl"
                        class="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-500 outline-none"
                    />
                    <Button variant="secondary" size="sm" @click="copy()">
                        <PhCheck
                            v-if="copied"
                            class="size-4 text-emerald-500"
                        />
                        <PhCopy v-else class="size-4" />
                    </Button>
                </div>
                <p v-else class="text-[11px] text-stone-400">
                    Public access is currently disabled.
                </p>
            </div>

            <div class="space-y-3">
                <label
                    class="text-[10px] font-black uppercase tracking-widest text-stone-400"
                    >Export Dimensions</label
                >
                <div class="grid grid-cols-2 gap-3">
                    <button
                        v-for="size in exportSizes"
                        :key="size.id"
                        @click="selectedSize = size"
                        :class="[
                            'flex flex-col gap-2 p-3 rounded-xl border text-left transition-all',
                            selectedSize.id === size.id
                                ? 'border-stone-900 ring-1 ring-stone-900'
                                : 'border-stone-200 hover:border-stone-300',
                        ]"
                    >
                        <component
                            :is="size.icon"
                            class="size-5"
                            :class="
                                selectedSize.id === size.id
                                    ? 'text-stone-900'
                                    : 'text-stone-400'
                            "
                        />
                        <div>
                            <p class="text-xs font-bold text-stone-900">
                                {{ size.label }}
                            </p>
                            <p class="text-[10px] text-stone-400">
                                {{ size.desc }}
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <template #footer="{ close }">
            <Button variant="secondary" class="flex-1" @click="close"
                >Cancel</Button
            >
            <Button
                :loading="isExporting"
                class="flex-1"
                @click="downloadImage"
            >
                <PhImage class="size-4 mr-2" />
                Download PNG
            </Button>
        </template>
    </Modal>
</template>
