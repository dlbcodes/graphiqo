<script setup lang="ts">
interface Props {
    totalItems: number;
    currentIndex: number;
    getProgress: (index: number) => number;
}

defineProps<Props>();
const emit = defineEmits<{
    "click-bar": [number];
}>();

const handleBarClick = (index: number) => {
    emit("click-bar", index);
};
</script>

<template>
    <div class="absolute top-0 left-0 right-0 z-50 flex gap-x-1 p-2 pt-safe">
        <div
            v-for="index in totalItems"
            :key="index"
            class="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
            @click.stop="handleBarClick(index - 1)"
        >
            <div
                class="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                :style="{ width: `${getProgress(index - 1)}%` }"
            />
        </div>
    </div>
</template>

<style scoped>
.pt-safe {
    padding-top: max(1rem, env(safe-area-inset-top));
}
</style>
