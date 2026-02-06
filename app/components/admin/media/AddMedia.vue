<script setup lang="ts">
import { PhImage } from "@phosphor-icons/vue";

defineProps<{
    disabled?: boolean;
}>();

const emit = defineEmits<{
    create: [];
}>();
</script>

<template>
    <div
        @click="emit('create')"
        class="flex justify-center items-center w-54 shrink-0 rounded-2xl aspect-9/16 border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer transition-colors"
    >
        <div
            class="flex flex-col gap-y-2 justify-center items-center text-center text-sm text-stone-500"
        >
            <PhImage class="size-8 shrink-0" />
            <span>
                Click to upload<br />
                new media
            </span>
        </div>
    </div>
</template>
