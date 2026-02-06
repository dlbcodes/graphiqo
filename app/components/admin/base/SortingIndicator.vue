<script setup lang="ts">
defineProps<{
    hasUnsavedOrder: boolean;
    isSorting: boolean;
}>();
</script>

<template>
    <div
        v-if="isSorting || hasUnsavedOrder"
        class="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 rounded-lg px-3"
    >
        <Spinner v-if="isSorting" class="size-4" />

        <div
            v-else
            class="inline-block rounded-full h-4 w-4 bg-amber-500"
        ></div>
        <span>{{
            isSorting ? "Saving order..." : "Order changed - saving soon..."
        }}</span>
    </div>
</template>
