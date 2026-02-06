<script setup lang="ts">
definePageMeta({ layout: "admin" });

const { register, error, loading, signOut } = useAuth();
</script>

<template>
    <NuxtLayout>
        <template #leftPane>
            <!-- <AccountNavigation /> -->
            Cenas
        </template>

        <div class="h-full">
            <NuxtPage />
        </div>
    </NuxtLayout>
</template>
