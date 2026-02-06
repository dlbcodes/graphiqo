<script setup lang="ts">
interface Props {
    pageData: {
        title: string;
        bio: string;
        avatarUrl: string;
        primaryColor: string;
    };
}

defineProps<Props>();
</script>

<template>
    <div class="flex items-center gap-x-3 p-4 pt-safe">
        <Avatar size="lg" :src="pageData.avatarUrl" />
        <div class="text-white">
            <h4 class="font-medium text-base">{{ pageData.title }}</h4>
            <p class="text-sm opacity-70">{{ pageData.bio }}</p>
        </div>
    </div>
</template>

<style scoped>
.pt-safe {
    padding-top: max(1rem, env(safe-area-inset-top));
}
</style>
