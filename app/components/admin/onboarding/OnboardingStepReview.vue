<script setup lang="ts">
import type { CreatePageDto } from "~/types/page";

interface Props {
    form: CreatePageDto;
    isCreating: boolean;
}

interface Emits {
    (e: "back"): void;
    (e: "create"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
    <div class="space-y-6">
        <div class="text-center mb-6">
            <Header
                title="You're all set! 🎉"
                subtitle=" Review your page and let's get started"
            />
        </div>

        <OnboardingPreview :form="form" />

        <div class="flex gap-4">
            <Button
                @click="emit('back')"
                :disabled="isCreating"
                variant="secondary"
            >
                Back
            </Button>
            <Button
                @click="emit('create')"
                :disabled="isCreating"
                :loading="isCreating"
                loadingText="Creating..."
            >
                Create My Page
            </Button>
        </div>
    </div>
</template>
