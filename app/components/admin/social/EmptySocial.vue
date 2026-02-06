<script setup lang="ts">
import { buttonVariants } from "~/variants/ButtonVariants";
import { PhPlus } from "@phosphor-icons/vue";

defineProps<{
    disabled: boolean;
}>();

const emit = defineEmits<{
    create: [];
}>();
</script>

<template>
    <div class="flex items-center gap-x-3">
        <button
            :class="
                cn(
                    buttonVariants({
                        variant: 'icon',
                        size: 'icon',
                    }),
                    'flex gap-x-2 text-sm text-stone-500 dark:text-stone-200'
                )
            "
            :disabled="disabled"
            @click="emit('create')"
        >
            <PhPlus class="size-5" />
            Add new social
        </button>
    </div>
</template>
