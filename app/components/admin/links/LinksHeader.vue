<script setup lang="ts">
defineProps<{
    isEmpty: boolean;
    isDisabled: boolean;
}>();

defineEmits<{
    add: [];
}>();
</script>

<template>
    <div class="flex items-center justify-between">
        <Header
            title="Page Links"
            subtitle="Direct links displayed on your page"
            size="sm"
        />
        <button
            v-if="!isEmpty"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isDisabled"
            @click="$emit('add')"
        >
            Add Link
        </button>
    </div>
</template>
