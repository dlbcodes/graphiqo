<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

interface Props {
    canGoPrevious: boolean;
    canGoNext: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
    previous: [];
    next: [];
}>();
</script>

<template>
    <div
        class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 z-40 pointer-events-none"
    >
        <button
            v-if="canGoPrevious"
            @click.stop="emit('previous')"
            class="bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-opacity opacity-0 md:opacity-100 pointer-events-auto"
        >
            <ChevronLeftIcon class="size-5 text-white/70" />
        </button>
        <button
            v-if="canGoNext"
            @click.stop="emit('next')"
            class="bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-opacity opacity-0 md:opacity-100 pointer-events-auto"
        >
            <ChevronRightIcon class="size-5 text-white/70" />
        </button>
    </div>
</template>