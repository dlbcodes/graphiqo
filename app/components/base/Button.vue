<script setup lang="ts">
import { buttonVariants, type ButtonProps } from "~/variants/ButtonVariants";

// Define props with default values
const props = withDefaults(
    defineProps<{
        variant?: ButtonProps["variant"];
        size?: ButtonProps["size"];
        class?: string | string[];
        to?: string;
        type?: "button" | "submit" | "reset";
        loading?: boolean;
        disabled?: boolean;
        loadingText?: string;
    }>(),
    {
        variant: "primary",
        size: "base",
        to: undefined,
        type: "button",
        loading: false,
        disabled: false,
        loadingText: "Loading...",
    }
);

// Determine the component type (button or NuxtLink) based on the presence of the `to` prop
const componentToDisplay = computed(() =>
    props.to ? resolveComponent("NuxtLink") : "button"
);

// Conditional classes based on loading state
const buttonClasses = computed(() => [
    buttonVariants({ variant: props.variant, size: props.size }),
    props.class,
]);

// Check if the component should render as a link
const isLink = computed(() => Boolean(props.to));

// Button should be disabled if loading or explicitly disabled
const isDisabled = computed(() => props.loading || props.disabled);
</script>

<template>
    <component
        :is="componentToDisplay"
        :to="isLink ? props.to : undefined"
        :type="isLink ? undefined : props.type"
        :class="cn(buttonClasses)"
        :disabled="isDisabled"
    >
        <div
            class="w-full flex justify-center items-center gap-x-2 -translate-y-px opacity-100 transition-all duration-100 ease-linear group-hover:translate-y-0 group-hover:opacity-90"
        >
            <!-- Loading state -->
            <template v-if="props.loading">
                <Spinner class="size-4" />
                <span>{{ props.loadingText }}</span>
            </template>

            <!-- Default content -->
            <slot v-else></slot>
        </div>
    </component>
</template>
