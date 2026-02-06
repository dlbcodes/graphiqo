<script setup lang="ts">
definePageMeta({
    layout: "base",
    middleware: "admin",
});
</script>

<template>
    <NuxtLayout>
        <div class="h-full">
            <NuxtPage />
        </div>
    </NuxtLayout>
</template>
