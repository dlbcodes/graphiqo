<script setup lang="ts">
import { inputVariants, type InputProps } from "~/variants/InputVariants";

const props = withDefaults(
    defineProps<{
        id?: string;
        modelValue: boolean;
        required?: boolean;
        disabled?: boolean;
        invalid?: boolean;
        class?: string;
        label?: string;
    }>(),
    {}
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const field = inject("field", props);
</script>

<template>
    <label
        :for="field.id"
        class="flex items-center gap-x-2 cursor-pointer select-none"
    >
        <div
            :class="[
                'w-4 h-4 rounded border flex items-center justify-center',
                field.invalid
                    ? 'border-red-600 bg-red-100'
                    : 'border-stone-400 bg-white hover:border-black',
                props.class,
            ]"
        >
            <input
                :id="field.id"
                type="checkbox"
                :checked="modelValue"
                :required="field.required"
                :disabled="field.disabled"
                class="opacity-0 absolute w-4 h-4 cursor-pointer"
                @change="emit('update:modelValue', $event.target.checked)"
            />

            <svg
                v-if="modelValue"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3"
                stroke="black"
                class="w-3 h-3 pointer-events-none"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                />
            </svg>
        </div>

        <!-- Use slot for label -->
        <slot />
    </label>
</template>
