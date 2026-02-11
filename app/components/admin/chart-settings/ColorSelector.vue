<script setup lang="ts">
import { computed } from "vue";
import { CHART_PALETTES } from "@/utils/chartConstants";
import {
    PhSparkle,
    PhPaintBrushBroad,
    PhPalette,
    PhMoon,
    PhSun,
} from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);
const brandStore = useBrandStore();

const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const selectBrand = (brandId: string) => {
    config.value = {
        ...config.value,
        brandProfileId: brandId,
        palette: null,
    };
};

const selectPalette = (colors: string[]) => {
    config.value = {
        ...config.value,
        brandProfileId: null,
        palette: colors,
    };
};

// Helper for the dark mode toggle
const toggleDarkMode = () => {
    config.value = {
        ...config.value,
        darkMode: !config.value.darkMode,
    };
};
</script>

<template>
    <Disclosure :defaultOpen="true" label="Colors & Branding">
        <template #icon>
            <PhPalette class="size-4 text-stone-500" />
        </template>

        <div class="space-y-6">
            <section>
                <header class="flex items-center gap-2 mb-3">
                    <component
                        :is="config.darkMode ? PhMoon : PhSun"
                        class="size-3 text-amber-500"
                        :weight="config.darkMode ? 'fill' : 'bold'"
                    />
                    <h4
                        class="text-[10px] font-black text-stone-400 uppercase tracking-widest"
                    >
                        Display Mode
                    </h4>
                </header>

                <button
                    @click="toggleDarkMode"
                    :class="[
                        'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs',
                        config.darkMode
                            ? 'bg-stone-900 border-stone-900 text-white shadow-inner'
                            : 'bg-white border-stone-100 text-stone-600 hover:border-stone-200 shadow-sm',
                    ]"
                >
                    <span v-if="config.darkMode" class="flex items-center gap-2"
                        >🌙 Dark Mode</span
                    >
                    <span v-else class="flex items-center gap-2"
                        >☀️ Light Mode</span
                    >
                </button>
            </section>

            <hr class="border-stone-100" />

            <section v-if="brandStore.brands.length > 0">
                <header class="flex items-center gap-2 mb-3">
                    <PhSparkle class="size-3 text-indigo-500" weight="fill" />
                    <h4
                        class="text-[10px] font-black text-stone-400 uppercase tracking-widest"
                    >
                        Brand Profiles
                    </h4>
                </header>

                <div class="grid grid-cols-1 gap-2">
                    <button
                        v-for="brand in brandStore.brands"
                        :key="brand.id"
                        @click="selectBrand(brand.id)"
                        :class="[
                            'flex items-center justify-between p-3 rounded-xl border-2 transition-all',
                            config.brandProfileId === brand.id
                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                : 'border-stone-50 hover:border-stone-200 bg-white',
                        ]"
                    >
                        <div class="flex items-center gap-3">
                            <div class="flex -space-x-1">
                                <div
                                    v-for="c in brand.palette.slice(0, 4)"
                                    :key="c"
                                    :style="{ backgroundColor: c }"
                                    class="size-4 rounded-full border border-white"
                                />
                            </div>
                            <span class="text-xs font-bold text-stone-700">{{
                                brand.name
                            }}</span>
                        </div>
                        <div
                            v-if="config.brandProfileId === brand.id"
                            class="size-2 rounded-full bg-indigo-600 animate-pulse"
                        />
                    </button>
                </div>
            </section>

            <hr v-if="brandStore.brands.length > 0" class="border-stone-100" />

            <section>
                <header class="flex items-center gap-2 mb-3">
                    <PhPaintBrushBroad class="size-3 text-stone-400" />
                    <h4
                        class="text-[10px] font-black text-stone-400 uppercase tracking-widest"
                    >
                        Standard Palettes
                    </h4>
                </header>

                <div class="grid grid-cols-3 gap-2">
                    <button
                        v-for="(colors, name) in CHART_PALETTES"
                        :key="name"
                        @click="selectPalette(colors)"
                        :class="[
                            'p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 group',
                            !config.brandProfileId &&
                            JSON.stringify(config.palette) ===
                                JSON.stringify(colors)
                                ? 'border-stone-900 bg-stone-50'
                                : 'border-stone-100 hover:border-stone-200 bg-white',
                        ]"
                    >
                        <div class="flex -space-x-1">
                            <div
                                v-for="(c, index) in colors.slice(0, 4)"
                                :key="c"
                                :style="{ backgroundColor: c }"
                                class="size-4 rounded-md border border-white"
                                :class="
                                    index % 2 == 1 ? '-rotate-6' : 'rotate-10'
                                "
                            />
                        </div>
                        <span
                            class="text-[10px] font-medium capitalize text-stone-500"
                            >{{ name }}</span
                        >
                    </button>
                </div>
            </section>
        </div>
    </Disclosure>
</template>
