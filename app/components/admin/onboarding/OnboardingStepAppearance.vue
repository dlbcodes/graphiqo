<script setup lang="ts">
interface Props {
    theme: "dark" | "light";
    primaryColor: string;
}

interface Emits {
    (e: "update:theme", value: "dark" | "light"): void;
    (e: "update:primaryColor", value: string): void;
    (e: "back"): void;
    (e: "next"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localTheme = computed({
    get: () => props.theme,
    set: (value) => emit("update:theme", value),
});

const localPrimaryColor = computed({
    get: () => props.primaryColor,
    set: (value) => emit("update:primaryColor", value),
});
</script>

<template>
    <div class="space-y-6">
        <div class="text-center mb-6">
            <Header
                title="Customize your look"
                subtitle="Choose your theme and colors"
            />
        </div>

        <Field id="theme" label="Theme">
            <div class="flex gap-4">
                <label class="flex-1 cursor-pointer">
                    <input
                        type="radio"
                        v-model="localTheme"
                        value="dark"
                        class="peer sr-only"
                    />
                    <div
                        class="p-4 border-2 border-stone-100 rounded-xl peer-checked:border-indigo-600 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 transition-colors"
                    >
                        <div class="w-full h-24 bg-stone-900 rounded mb-2" />
                        <p class="text-center font-medium text-stone-900">
                            Dark
                        </p>
                    </div>
                </label>
                <label class="flex-1 cursor-pointer">
                    <input
                        type="radio"
                        v-model="localTheme"
                        value="light"
                        class="peer sr-only"
                    />
                    <div
                        class="p-4 border-2 border-stone-100 rounded-xl peer-checked:border-indigo-600 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 transition-colors"
                    >
                        <div
                            class="w-full h-24 bg-white border border-stone-200 rounded mb-2"
                        />
                        <p class="text-center font-medium text-stone-900">
                            Light
                        </p>
                    </div>
                </label>
            </div>
        </Field>

        <Field id="primaryColor" label="Accent Color">
            <div class="flex gap-2">
                <input
                    type="color"
                    v-model="localPrimaryColor"
                    class="size-12 rounded cursor-pointer"
                />
                <Input type="text" v-model="localPrimaryColor" class="flex-1" />
            </div>
        </Field>

        <div class="flex gap-4">
            <Button @click="emit('back')" variant="secondary"> Back </Button>
            <Button @click="emit('next')"> Continue </Button>
        </div>
    </div>
</template>
