<script setup lang="ts">
interface Props {
    title: string;
    slug: string;
}

interface Emits {
    (e: "update:title", value: string): void;
    (e: "update:slug", value: string): void;
    (e: "next"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localTitle = computed({
    get: () => props.title,
    set: (value) => emit("update:title", value),
});

const localSlug = computed({
    get: () => props.slug,
    set: (value) => emit("update:slug", value),
});

const canContinue = computed(() => props.title && props.slug);
</script>

<template>
    <div class="space-y-6">
        <div class="text-center mb-6">
            <Header
                title="Let's start with the basics"
                subtitle="Choose your page name and URL"
            />
        </div>

        <Field id="title" label="Your Name or Brand" required>
            <Input
                type="text"
                v-model="localTitle"
                placeholder="John Doe"
                class="text-lg"
            />
        </Field>

        <Field id="slug" label="Your Custom URL" required>
            <template #description>
                <span class="text-sm text-gray-500">
                    datomi.com/<strong>{{ slug || "your-url" }}</strong>
                </span>
            </template>
            <Input
                type="text"
                v-model="localSlug"
                placeholder="johndoe"
                class="text-lg"
            />
        </Field>

        <Button @click="emit('next')" :disabled="!canContinue">
            Continue
        </Button>
    </div>
</template>
