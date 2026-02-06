<script setup lang="ts">
import { ref, computed } from "vue";
import type { SocialPlatform } from "~/utils/socialPlatforms";
import { PhMagnifyingGlass } from "@phosphor-icons/vue";

const props = defineProps<{
    platforms: SocialPlatform[];
    isLoading: boolean;
}>();

const emit = defineEmits<{
    select: [platform: SocialPlatform];
}>();

// ----- Local search state (belongs here)
const search = ref("");

// ----- Filtering
const filteredPlatforms = computed(() => {
    if (!search.value.trim()) return props.platforms;

    const q = search.value.toLowerCase();
    return props.platforms.filter(
        (p) =>
            p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q)
    );
});
</script>

<template>
    <div class="flex flex-col gap-y-3">
        <!-- Search -->
        <div class="relative">
            <Input
                v-model="search"
                type="text"
                placeholder="Search platforms..."
                :disabled="isLoading"
                autocomplete="off"
            >
                <PhMagnifyingGlass class="size-5 text-stone-400" />
            </Input>
        </div>

        <!-- List -->
        <div class="flex flex-col gap-y-1 h-72 overflow-y-auto no-scrollbar">
            <p
                v-if="filteredPlatforms.length === 0"
                class="text-center py-8 text-sm text-stone-500"
            >
                No platforms found
            </p>

            <button
                v-for="social in filteredPlatforms"
                :key="social.key"
                @click="emit('select', social)"
                :disabled="isLoading"
                class="flex items-center gap-x-3 px-4 py-3 rounded-xl hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <component :is="social.icon" class="size-6 shrink-0" />
                <span class="truncate font-medium">{{ social.name }}</span>
            </button>
        </div>
    </div>
</template>
