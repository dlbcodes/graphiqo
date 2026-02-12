<script setup lang="ts">
import {
    PhList,
    PhPresentation,
    PhShareNetwork,
    PhCloudCheck,
    PhCircleNotch,
} from "@phosphor-icons/vue";
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
    isSaving: boolean;
    lastSaved: Date | null;
}>();

const store = useDashboardStore();
const timeAgo = useTimeAgo(() => props.lastSaved ?? new Date());

// Derived state for breadcrumbs
const activeChart = computed(() => {
    const charts = store.currentDashboard?.charts;
    return charts?.find((c) => c.id === store.activeChartId) || charts?.[0];
});
</script>

<template>
    <header class="h-18 px-6 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
            <Button variant="icon" size="icon" @click="navigateTo('/admin')">
                <PhList class="size-5 shrink-0" />
            </Button>
            <ClientOnly>
                <BreadcrumbNav />
            </ClientOnly>
        </div>

        <div class="flex items-center gap-6">
            <div class="flex items-center gap-2 tabular-nums">
                <template v-if="isSaving">
                    <PhCircleNotch class="size-4 text-amber-500 animate-spin" />
                    <span
                        class="text-[10px] font-bold text-stone-500 uppercase tracking-[0.15em]"
                        >Syncing</span
                    >
                </template>
                <template v-else-if="lastSaved">
                    <PhCloudCheck class="size-4 text-emerald-500" />
                    <span class="text-[11px] text-stone-400 font-medium"
                        >Saved {{ timeAgo }}</span
                    >
                </template>
            </div>

            <div class="flex items-center gap-3">
                <Button variant="secondary">
                    <PhPresentation class="size-5 shrink-0" />
                    Presentation
                </Button>
                <Button>
                    <PhShareNetwork class="size-5 shrink-0" />
                    Share
                </Button>
            </div>
        </div>
    </header>
</template>
