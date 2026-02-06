<script setup lang="ts">
import type { SocialPlatform } from "~/utils/socialPlatforms";
import { PhArrowLeft } from "@phosphor-icons/vue";

defineProps<{
    social: SocialPlatform;
    url: string;
    isEditMode: boolean;
    isUrlValid: boolean;
    isLoading: boolean;
}>();

const emit = defineEmits<{
    "update:url": [string];
    back: [];
    submit: [];
    delete: [];
}>();
</script>

<template>
    <div class="flex flex-col gap-y-4">
        <button
            v-if="!isEditMode"
            @click="emit('back')"
            class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
            <PhArrowLeft class="size-4" />
            <span>Back to platforms</span>
        </button>

        <Field
            id="social-url"
            :label="`${social.name} URL`"
            required
            :placeholder="social.placeholder"
            :help="`Example: ${social.placeholder}`"
        >
            <Input
                type="url"
                :model-value="url"
                @update:model-value="emit('update:url', $event ?? '')"
                :placeholder="social.placeholder"
                :disabled="isLoading"
            />
        </Field>

        <p v-if="!isUrlValid" class="text-xs text-red-600">
            Invalid URL for {{ social.name }}
        </p>
    </div>
</template>
