<script setup lang="ts">
import { inputVariants, type InputProps } from "~/variants/InputVariants";

const props = withDefaults(
    defineProps<{
        variant?: InputProps["variant"];
        size?: InputProps["size"];
        id?: string;
        modelValue: boolean;
        required?: boolean;
        disbabled?: boolean;
        invalid?: boolean;
        class?: string;
    }>(),
    {
        variant: "primary",
        size: "base",
        loading: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean | null): void;
}>();
</script>

<template>
    <label
        :class="
            cn(
                'relative inline-flex items-center cursor-pointer text-sm',
                props.class
            )
        "
    >
        <div class="relative">
            <input
                type="checkbox"
                :checked="modelValue"
                :id="id"
                class="sr-only peer"
                :disabled="disbabled"
                @input="
                    emit(
                        'update:modelValue',
                        ($event.target as HTMLInputElement).checked
                    )
                "
            />
            <div
                class="w-11 h-6 bg-[rgba(0,0,0,0.08)] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-gray-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border after:border-stone-700 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"
            ></div>
        </div>
        <span class="flex items-center text-stone-950">
            <slot></slot>
        </span>
    </label>
</template>
