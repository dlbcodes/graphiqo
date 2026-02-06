<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        title: string;
        subtitle: string;
        size?: "sm" | "md" | "lg" | "xl";
    }>(),
    {
        size: "md",
    }
);

const titleClass = computed(() => {
    return {
        sm: "text-lg font-medium",
        md: "text-2xl font-semibold",
        lg: "text-3xl font-bold",
        xl: "text-4xl font-bold",
    }[props.size];
});
</script>

<template>
    <div class="flex flex-col">
        <h2 :class="titleClass">
            {{ title }}
        </h2>
        <p class="text-sm text-stone-600">
            {{ subtitle }}
        </p>
    </div>
</template>
