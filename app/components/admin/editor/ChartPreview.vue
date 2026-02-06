<script setup lang="ts">
const props = defineProps<{
    options: any;
}>();
</script>

<template>
    <div class="h-full w-full min-h-[400px]">
        <ClientOnly>
            <v-chart :option="options" autoresize class="chart-container" />

            <template #placeholder>
                <div
                    class="flex items-center justify-center h-full bg-gray-50 rounded-xl"
                >
                    <div
                        class="animate-pulse text-gray-300 font-medium text-sm tracking-widest uppercase"
                    >
                        Rendering Chart
                    </div>
                </div>
            </template>
        </ClientOnly>
    </div>
</template>

<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
}
</style>
