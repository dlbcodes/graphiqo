<script setup lang="ts">
import type { SocialPlatform } from "~/utils/socialPlatforms";

defineProps<{
    social: SocialPlatform;
    url: string;
    isLoading: boolean;
}>();

const emit = defineEmits<{
    back: [];
    confirm: [];
}>();
</script>

<template>
    <div class="text-center space-y-4">
        <p class="font-semibold">Delete {{ social.name }} link?</p>

        <p class="text-sm text-stone-600 truncate">
            {{ url }}
        </p>
    </div>
</template>
