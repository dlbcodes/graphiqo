<script setup lang="ts">
import { CHART_PALETTES } from "@/utils/chartConstants";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const brandStore = useBrandStore();
const palettes = CHART_PALETTES;

const updateColumnType = (colKey: string, type: string) => {
    const currentTypes = props.modelValue.columnTypes || {};
    updateConfig("columnTypes", { ...currentTypes, [colKey]: type });
};

const updateConfig = (key: string, value: any) => {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const updateBrandLink = (brandId: string) => {
    updateConfig("brandProfileId", brandId);
};
</script>

<template>
    <div
        class="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-h-[70vh] overflow-y-auto custom-scrollbar"
    >
        <section>
            <h4
                class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3"
            >
                Brand Style Profile
            </h4>
            <select
                :value="modelValue.brandProfileId || ''"
                @change="
                    (e) =>
                        updateBrandLink((e.target as HTMLSelectElement).value)
                "
                class="w-full text-xs p-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
                <option value="">Default (Use Palette Below)</option>
                <option
                    v-for="brand in brandStore.brands"
                    :key="brand.id"
                    :value="brand.id"
                >
                    ✨ {{ brand.name }}
                </option>
            </select>
        </section>

        <section>
            <h4
                class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3"
            >
                Color Palette
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                    v-for="(colors, name) in palettes"
                    :key="name"
                    @click="updateConfig('palette', colors)"
                    :class="[
                        'p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                        JSON.stringify(modelValue.palette) ===
                        JSON.stringify(colors)
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-50 hover:border-gray-200',
                    ]"
                >
                    <div class="flex -space-x-1">
                        <div
                            v-for="c in colors.slice(0, 4)"
                            :key="c"
                            :style="{ backgroundColor: c }"
                            class="w-4 h-4 rounded-full border border-white"
                        />
                    </div>
                    <span
                        class="text-[10px] font-bold capitalize text-gray-600"
                        >{{ name }}</span
                    >
                </button>
            </div>
        </section>

        <hr class="border-gray-50" />

        <section class="bg-rose-50 p-4 rounded-2xl border border-rose-100">
            <h4
                class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3"
            >
                Goal / Target Line
            </h4>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-[9px] text-rose-600 font-bold mb-1 block"
                        >Value</label
                    >
                    <input
                        type="number"
                        :value="modelValue.goalValue"
                        @input="
                            (e) =>
                                updateConfig(
                                    'goalValue',
                                    Number(
                                        (e.target as HTMLInputElement).value,
                                    ),
                                )
                        "
                        class="w-full text-xs p-2 bg-white rounded-lg border-none focus:ring-2 focus:ring-rose-500"
                        placeholder="e.g. 100"
                    />
                </div>
                <div>
                    <label class="text-[9px] text-rose-600 font-bold mb-1 block"
                        >Label</label
                    >
                    <input
                        :value="modelValue.goalLabel"
                        @input="
                            (e) =>
                                updateConfig(
                                    'goalLabel',
                                    (e.target as HTMLInputElement).value,
                                )
                        "
                        class="w-full text-xs p-2 bg-white rounded-lg border-none focus:ring-2 focus:ring-rose-500"
                        placeholder="Target"
                    />
                </div>
            </div>
        </section>

        <section class="grid grid-cols-2 gap-6">
            <div class="space-y-3">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Visual Logic
                </h4>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            :checked="modelValue.smooth"
                            @change="updateConfig('smooth', !modelValue.smooth)"
                            class="rounded text-indigo-600"
                        />
                        <span
                            class="text-xs font-semibold text-gray-700 group-hover:text-indigo-600 transition"
                            >Smooth Curves</span
                        >
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            :checked="modelValue.area"
                            @change="updateConfig('area', !modelValue.area)"
                            class="rounded text-indigo-600"
                        />
                        <span
                            class="text-xs font-semibold text-gray-700 group-hover:text-indigo-600 transition"
                            >Fill Background</span
                        >
                    </label>
                </div>
            </div>
            <div class="space-y-3">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Grid & Guides
                </h4>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            :checked="modelValue.showGrid"
                            @change="
                                updateConfig('showGrid', !modelValue.showGrid)
                            "
                            class="rounded text-indigo-600"
                        />
                        <span
                            class="text-xs font-semibold text-gray-700 group-hover:text-indigo-600 transition"
                            >Show Grid Lines</span
                        >
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            :checked="modelValue.showLabels"
                            @change="
                                updateConfig(
                                    'showLabels',
                                    !modelValue.showLabels,
                                )
                            "
                            class="rounded text-indigo-600"
                        />
                        <span
                            class="text-xs font-semibold text-gray-700 group-hover:text-indigo-600 transition"
                            >Show Data Labels</span
                        >
                    </label>
                </div>
            </div>
        </section>

        <hr class="border-gray-50" />

        <section class="grid grid-cols-2 gap-6">
            <div class="space-y-3">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Typography
                </h4>
                <select
                    :value="modelValue.fontSize || 12"
                    @change="
                        (e) =>
                            updateConfig(
                                'fontSize',
                                Number((e.target as HTMLSelectElement).value),
                            )
                    "
                    class="w-full text-xs p-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option :value="10">Small (10px)</option>
                    <option :value="12">Medium (12px)</option>
                    <option :value="14">Large (14px)</option>
                    <option :value="18">X-Large (18px)</option>
                </select>
            </div>
            <div class="space-y-3">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Visibility
                </h4>
                <div class="flex flex-col gap-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            :checked="!modelValue.hideX"
                            @change="updateConfig('hideX', !modelValue.hideX)"
                            class="rounded text-indigo-600"
                        />
                        <span class="text-xs font-semibold text-gray-700"
                            >Show X Axis</span
                        >
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            :checked="!modelValue.hideY"
                            @change="updateConfig('hideY', !modelValue.hideY)"
                            class="rounded text-indigo-600"
                        />
                        <span class="text-xs font-semibold text-gray-700"
                            >Show Y Axis</span
                        >
                    </label>
                </div>
            </div>
        </section>

        <hr class="border-gray-50" />

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3"
                >
                    Layout Controls
                </h4>
                <label
                    class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                    <input
                        type="checkbox"
                        :checked="modelValue.stack"
                        @change="updateConfig('stack', !modelValue.stack)"
                        class="rounded text-indigo-600 w-4 h-4"
                    />
                    <span class="text-xs font-semibold text-gray-700"
                        >Stack Series</span
                    >
                </label>
                <label
                    class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                    <input
                        type="checkbox"
                        :checked="modelValue.horizontal"
                        @change="
                            updateConfig('horizontal', !modelValue.horizontal)
                        "
                        class="rounded text-indigo-600 w-4 h-4"
                    />
                    <span class="text-xs font-semibold text-gray-700"
                        >Horizontal Layout</span
                    >
                </label>
            </div>

            <div class="space-y-3">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Formatting
                </h4>
                <input
                    :value="modelValue.suffix"
                    @input="
                        (e) =>
                            updateConfig(
                                'suffix',
                                (e.target as HTMLInputElement).value,
                            )
                    "
                    class="w-full text-xs p-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Suffix (%, $)"
                />
                <select
                    :value="modelValue.precision || 0"
                    @change="
                        (e) =>
                            updateConfig(
                                'precision',
                                Number((e.target as HTMLSelectElement).value),
                            )
                    "
                    class="w-full text-xs p-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option :value="0">0 (Whole)</option>
                    <option :value="1">0.1 (Dec)</option>
                    <option :value="2">0.01 (Cents)</option>
                </select>
            </div>
        </section>

        <hr class="border-gray-50" />

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between"
                >
                    Line Weight <span>{{ modelValue.lineWidth || 2 }}px</span>
                </label>
                <input
                    type="range"
                    min="1"
                    max="8"
                    :value="modelValue.lineWidth || 2"
                    @input="
                        (e) =>
                            updateConfig(
                                'lineWidth',
                                Number((e.target as HTMLInputElement).value),
                            )
                    "
                    class="w-full accent-indigo-600 mt-2"
                />
            </div>
            <div>
                <label
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between"
                >
                    Dot Size <span>{{ modelValue.symbolSize ?? 4 }}px</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="12"
                    :value="modelValue.symbolSize ?? 4"
                    @input="
                        (e) =>
                            updateConfig(
                                'symbolSize',
                                Number((e.target as HTMLInputElement).value),
                            )
                    "
                    class="w-full accent-indigo-600 mt-2"
                />
            </div>
        </section>

        <section class="border-t pt-4">
            <h4
                class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3"
            >
                Mixed Mode (Column Overrides)
            </h4>
            <div
                class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar"
            >
                <div
                    v-for="i in 5"
                    :key="i"
                    class="flex items-center justify-between bg-gray-50 p-2 rounded-xl"
                >
                    <span class="text-[10px] font-bold text-gray-600 uppercase"
                        >Col {{ i }}</span
                    >
                    <div
                        class="flex gap-1 bg-white p-1 rounded-lg border border-gray-100"
                    >
                        <button
                            v-for="type in ['bar', 'line', 'scatter']"
                            :key="type"
                            @click="updateColumnType(`val${i}`, type)"
                            :class="[
                                'px-2 py-1 text-[9px] rounded font-black uppercase transition',
                                modelValue.columnTypes?.[`val${i}`] === type
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-400',
                            ]"
                        >
                            {{ type }}
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <hr class="border-gray-50" />

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Display Mode
                </h4>
                <button
                    @click="updateConfig('darkMode', !modelValue.darkMode)"
                    :class="[
                        'w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 transition-all font-bold text-xs',
                        modelValue.darkMode
                            ? 'bg-gray-900 border-gray-900 text-white'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200',
                    ]"
                >
                    <span v-if="modelValue.darkMode">🌙 Dark Mode</span>
                    <span v-else>☀️ Light Mode</span>
                </button>
            </div>

            <div class="space-y-3">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Legend Settings
                </h4>
                <div class="flex flex-col gap-2">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            :checked="modelValue.showLegend !== false"
                            @change="
                                updateConfig(
                                    'showLegend',
                                    modelValue.showLegend === false,
                                )
                            "
                            class="rounded text-indigo-600"
                        />
                        <span class="text-xs font-semibold text-gray-700"
                            >Show Legend</span
                        >
                    </label>

                    <select
                        v-if="modelValue.showLegend !== false"
                        :value="modelValue.legendPosition || 'bottom'"
                        @change="
                            (e) =>
                                updateConfig(
                                    'legendPosition',
                                    (e.target as HTMLSelectElement).value,
                                )
                        "
                        class="w-full text-[10px] p-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    >
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left Side</option>
                        <option value="right">Right Side</option>
                    </select>
                </div>
            </div>
        </section>

        <div>
            <label class="text-[9px] text-gray-400 font-bold mb-1 block"
                >Font Family</label
            >
            <select
                :value="modelValue.fontFamily || 'Geist'"
                @change="
                    (e) =>
                        updateConfig(
                            'fontFamily',
                            (e.target as HTMLSelectElement).value,
                        )
                "
                class="w-full text-xs p-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
                <option value="Geist">Geist (Modern)</option>
                <option value="Inter">Inter (Standard)</option>
                <option value="Geist Mono">Geist Mono (Technical)</option>
                <option value="Playfair Display">Classic (Serif)</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 10px;
}
</style>
