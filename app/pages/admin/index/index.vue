<script setup lang="ts">
// This page should never render because middleware redirects
// But just in case, show loading state

// definePageMeta({
//     middleware: "admin",
// });

// const pageStore = usePageStore();
// const { isLoading } = storeToRefs(pageStore);
</script>

<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <Spinner />
            <p class="text-gray-600 dark:text-gray-400">
                Loading your pages...
            </p>
        </div>
    </div>
</template>
