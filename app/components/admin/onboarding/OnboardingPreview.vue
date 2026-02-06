<script setup lang="ts">
import type { CreatePageDto } from "~/types/page";

interface Props {
    form: CreatePageDto;
}

defineProps<Props>();
</script>

<template>
    <div
        class="bg-stone-50 dark:bg-stone-900 rounded-lg p-6 border-2 border-dashed border-stone-300 dark:border-stone-700"
    >
        <div class="text-center">
            <div
                class="w-20 h-20 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-3"
            />
            <h3 class="text-xl font-bold mb-1">
                {{ form.title }}
            </h3>
            <p class="text-sm text-stone-600 dark:text-stone-400">
                liqo.app/{{ form.slug }}
            </p>
            <div
                class="mt-4 px-6 py-2 rounded-lg inline-block text-white"
                :style="{ backgroundColor: form.primaryColor }"
            >
                Sample Button
            </div>
        </div>
    </div>
</template>
