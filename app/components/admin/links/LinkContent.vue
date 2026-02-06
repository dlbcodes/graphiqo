<script setup lang="ts">
import type { PageLink } from "@/types/page";

const props = defineProps<{
    link: PageLink;
}>();

const emit = defineEmits<{
    edit: [];
    toggle: [data: { isActive: boolean }];
}>();

const onToggle = () => {
    emit("toggle", { isActive: !props.link.isActive });
};
</script>

<template>
    <div class="flex items-center justify-between gap-4 w-full">
        <div
            class="min-w-0 flex-1 hover:underline cursor-pointer"
            @click="emit('edit')"
        >
            <div class="flex items-center gap-2 min-w-0">
                <h6 class="font-medium text-stone-900 truncate">
                    {{ link.title }}
                </h6>
                <span
                    v-if="!link.isActive"
                    class="px-2 py-0.5 text-xs font-medium bg-stone-300 text-stone-700 rounded-full shrink-0"
                >
                    Hidden
                </span>
            </div>

            <p
                class="font-mono text-xs text-stone-600 truncate block max-w-full"
            >
                {{ link.url }}
            </p>
        </div>

        <div class="shrink-0">
            <Switch
                :model-value="link.isActive"
                @update:model-value="onToggle"
                :title="link.isActive ? 'Hide link' : 'Show link'"
                :aria-label="link.isActive ? 'Hide link' : 'Show link'"
            />
        </div>
    </div>
</template>
