<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const props = withDefaults(
    defineProps<{
        label: string;
        defaultOpen?: boolean;
        class?: string | string[];
    }>(),
    {
        defaultOpen: false,
    },
);
</script>

<template>
    <Disclosure v-slot="{ open }" :defaultOpen="defaultOpen">
        <div class="relative w-full border-b border-stone-200">
            <!-- Button -->
            <DisclosureButton
                class="flex items-center justify-between w-full px-2 py-4 font-semibold text-[13px] text-stone-900 focus:outline-none dark:text-dark-200 dark:bg-dark-950"
            >
                <span>{{ label }}</span>

                <ChevronRightIcon
                    :class="{ 'rotate-90': open }"
                    class="transition-transform size-4"
                />
            </DisclosureButton>

            <!-- Menu -->
            <DisclosurePanel
                :class="
                    cn('w-full overflow-visible px-2 pt-2 pb-4', props.class)
                "
            >
                <slot></slot>
            </DisclosurePanel>
        </div>
    </Disclosure>
</template>
