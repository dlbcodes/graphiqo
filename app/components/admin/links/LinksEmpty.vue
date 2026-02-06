<script setup lang="ts">
defineProps<{
    isDisabled: boolean;
}>();

defineEmits<{
    add: [];
}>();
</script>

<template>
    <div
        class="text-center py-12 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200"
    >
        <div class="text-4xl mb-4">🔗</div>
        <h4 class="text-base font-semibold text-stone-900 mb-2">
            No links yet
        </h4>
        <p class="text-sm text-stone-600 mb-4">
            Add your first link to get started
        </p>
        <button
            class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isDisabled"
            @click="$emit('add')"
        >
            Add Your First Link
        </button>
    </div>
</template>
