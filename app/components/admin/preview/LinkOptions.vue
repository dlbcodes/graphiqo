<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { PhCopy, PhCheck, PhGear } from "@phosphor-icons/vue";

const base_url = useRuntimeConfig().public.BASE_URL;

const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);

// Defensive computed: if slug not ready, show placeholder or empty string
const fullLink = computed(() => {
    return currentPage.value?.slug
        ? `${base_url}/${currentPage.value.slug}`
        : "";
});

// Reactive source for clipboard text
const source = ref("");

// Whenever fullLink updates, update source for clipboard
watch(
    fullLink,
    (newVal) => {
        source.value = newVal;
    },
    { immediate: true },
);

// Initialize useClipboard with reactive source
const { copy, copied, isSupported } = useClipboard({ source });
</script>

<template>
    <div
        class="fixed top-2 flex items-center bg-white border border-stone-200 shadow-sm rounded-2xl divide-x divide-stone-100"
    >
        <button
            @click="copy()"
            class="group flex items-center gap-x-2 py-2 px-4 cursor-pointer select-none"
        >
            <p class="text-sm font-medium">
                {{ fullLink || "Loading link..." }}
            </p>
            <PhCopy v-if="!copied" class="size-4 shrink-0 text-stone-500" />
            <PhCheck v-else class="size-4 shrink-0 text-stone-500" />
        </button>
        <div class="px-2">
            <PhGear class="size-4 shrink-0" />
        </div>
    </div>
</template>
