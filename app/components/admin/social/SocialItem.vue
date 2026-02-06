<script setup lang="ts">
import { buttonVariants } from "~/variants/ButtonVariants";
import { PhPlus } from "@phosphor-icons/vue";
import type { SocialLink } from "@/types/page";

const props = defineProps<{
    item: SocialLink;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    edit: [social: SocialLink];
}>();
</script>

<template>
    <button
        @click="emit('edit', item)"
        class="drag-handle relative group"
        :class="
            cn(
                buttonVariants({
                    variant: 'icon',
                    size: 'icon',
                }),
                'cursor-grab dark:text-stone-200 active:cursor-grabbing'
            )
        "
        :title="item.platform"
    >
        <component
            :is="getSocialPlatformIcon(item.platform)"
            class="size-5 shrink-0"
        />
    </button>
</template>
