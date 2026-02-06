<script setup lang="ts">
import { PhCheck } from "@phosphor-icons/vue";

export interface Step {
    label: string;
    icon?: string; // Can be an emoji, icon name, or image URL
}

interface Props {
    currentStep: number;
    steps: Step[];
}

defineProps<Props>();

const isImageUrl = (icon: string) => {
    return (
        icon.startsWith("http") ||
        icon.startsWith("/") ||
        icon.endsWith(".png") ||
        icon.endsWith(".jpg") ||
        icon.endsWith(".svg")
    );
};
</script>

<template>
    <div class="flex items-center justify-center mb-6">
        <div class="flex items-center gap-2">
            <template v-for="(step, index) in steps" :key="index">
                <div class="flex flex-col items-center gap-2">
                    <div
                        class="flex items-center gap-x-2 px-4 py-px"
                        :class="
                            currentStep >= index + 1
                                ? 'opacity-100'
                                : 'opacity-50'
                        "
                    >
                        <div
                            v-if="step.icon && isImageUrl(step.icon)"
                            class="flex items-center gap-x-1"
                        >
                            <img
                                :src="step.icon"
                                :alt="step.label"
                                class="size-8 object-contain"
                            />
                            <span
                                class="text-xs font-medium transition-colors whitespace-nowrap"
                                :class="
                                    currentStep >= index + 1
                                        ? 'text-stone-900 dark:text-stone-400'
                                        : 'text-stone-500 dark:text-stone-400'
                                "
                            >
                                {{ step.label }}
                            </span>
                            <PhCheck
                                v-if="currentStep > index + 1"
                                class="size-4 stroke-3 text-green-600"
                            />
                        </div>
                        <span v-else-if="step.icon">{{ step.icon }}</span>
                        <span v-else>{{ index + 1 }}</span>
                    </div>
                </div>
                <div
                    v-if="index < steps.length - 1"
                    class="w-12 h-1 bg-stone-200 dark:bg-stone-700 transition-colors duration-300"
                    :class="{ 'bg-stone-300': currentStep > index + 1 }"
                />
            </template>
        </div>
    </div>
</template>
