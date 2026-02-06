<script setup lang="ts">
const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

// Professional Palettes
const palettes = {
    vibrant: [
        "#4f39f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899",
    ],
    corporate: [
        "#1e293b",
        "#334155",
        "#475569",
        "#64748b",
        "#94a3b8",
        "#cbd5e1",
    ],
    sunset: ["#f43f5e", "#fb923c", "#facc15", "#a78bfa", "#22d3ee"],
    monochrome: ["#111827", "#374151", "#6b7280", "#9ca3af", "#d1d5db"],
};

const updateConfig = (key: string, value: any) => {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
};
</script>

<template>
    <div
        class="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
    >
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

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Chart Display
                </h4>
                <div class="grid grid-cols-1 gap-2">
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
                            >Stack Series (Accumulative)</span
                        >
                    </label>
                    <label
                        class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                    >
                        <input
                            type="checkbox"
                            :checked="modelValue.horizontal"
                            @change="
                                updateConfig(
                                    'horizontal',
                                    !modelValue.horizontal,
                                )
                            "
                            class="rounded text-indigo-600 w-4 h-4"
                        />
                        <span class="text-xs font-semibold text-gray-700"
                            >Horizontal Layout</span
                        >
                    </label>
                    <label
                        class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                    >
                        <input
                            type="checkbox"
                            :checked="modelValue.area"
                            @change="updateConfig('area', !modelValue.area)"
                            class="rounded text-indigo-600 w-4 h-4"
                        />
                        <span class="text-xs font-semibold text-gray-700"
                            >Fill Area (Volume)</span
                        >
                    </label>
                </div>
            </div>

            <div class="space-y-4">
                <h4
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                >
                    Formatting
                </h4>
                <div class="space-y-3">
                    <div>
                        <label
                            class="text-[9px] text-gray-400 font-bold mb-1 block"
                            >Value Suffix (e.g. %, $)</label
                        >
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
                            placeholder="Unit..."
                        />
                    </div>
                    <div>
                        <label
                            class="text-[9px] text-gray-400 font-bold mb-1 block"
                            >Decimal Precision</label
                        >
                        <select
                            :value="modelValue.precision || 0"
                            @change="
                                (e) =>
                                    updateConfig(
                                        'precision',
                                        Number(
                                            (e.target as HTMLSelectElement)
                                                .value,
                                        ),
                                    )
                            "
                            class="w-full text-xs p-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option :value="0">0 (Whole Numbers)</option>
                            <option :value="1">0.0 (One Decimal)</option>
                            <option :value="2">0.00 (Two Decimals)</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>

        <hr class="border-gray-50" />

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <div class="flex justify-between mb-2">
                    <label
                        class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                        >Line Weight</label
                    >
                    <span class="text-[10px] font-bold text-indigo-600"
                        >{{ modelValue.lineWidth || 2 }}px</span
                    >
                </div>
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
                    class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
            </div>
            <div>
                <div class="flex justify-between mb-2">
                    <label
                        class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                        >Dot Size</label
                    >
                    <span class="text-[10px] font-bold text-indigo-600"
                        >{{ modelValue.symbolSize ?? 4 }}px</span
                    >
                </div>
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
                    class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
            </div>
        </section>
    </div>
</template>
