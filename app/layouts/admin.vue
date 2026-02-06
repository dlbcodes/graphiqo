<script setup lang="ts">
import { ArrowDownLeftIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { PhSidebarSimple } from "@phosphor-icons/vue";
import { buttonVariants } from "~/variants/ButtonVariants";

const isSidebarCollapsed = ref(false);
const announcement = ref(
    "Trial wraps up in 1 day! Grab a plan (yes, there’s a $0 one) so your analytics don’t go poof.",
);

// Shortcut to toggle sidebar
useAppShortcut("Cmd+Shift+C", () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
});
</script>

<template>
    <div
        class="relative flex h-screen bg-stone-100 bg-[repeating-linear-gradient(135deg,var(--color-stone-100)_0px,var(--color-stone-100)_1px,transparent_1px,transparent_20px)] dark:bg-dark-950 dark:bg-[repeating-linear-gradient(135deg,#202020_0px,#202020_1px,transparent_1px,transparent_20px)]"
    >
        <!-- Sidebar -->
        <div
            class="flex flex-col border-r border-stone-100 bg-stone-100 dark:bg-dark-900 dark:border-black dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)] transition-all duration-300 ease-in-out"
            :class="isSidebarCollapsed ? 'w-0 overflow-hidden' : 'w-[220px]'"
        >
            <!-- Sidebar Header -->
            <div class="h-12 shrink-0">
                <div
                    class="flex items-center justify-between h-full min-w-0 px-4"
                >
                    <Logo to="/admin" class="w-26" />
                </div>
            </div>

            <!-- Sidebar Content -->
            <div class="flex-1 overflow-y-auto p-2">
                <slot name="leftPane"></slot>
            </div>
        </div>

        <!-- Toggle Button - Outside sidebar so it stays visible -->
        <ClientOnly>
            <button
                @click="isSidebarCollapsed = !isSidebarCollapsed"
                :class="
                    cn(
                        buttonVariants({ variant: 'icon', size: 'icon' }),
                        'flex justify-center items-center absolute top-3 z-30 p-1 transition-all duration-300 ease-in-out',
                    )
                "
                :style="{ left: isSidebarCollapsed ? '6px' : '180px' }"
            >
                <PhSidebarSimple
                    class="size-5 shrink-0 text-stone-950 dark:text-dark-300"
                    :class="{ 'rotate-180': isSidebarCollapsed }"
                    :weight="isSidebarCollapsed ? 'fill' : 'regular'"
                />
            </button>
        </ClientOnly>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <!-- Scrollable Content -->
            <div
                class="pb-10 flex-1 overflow-y-auto bg-stone-50 bg-[repeating-linear-gradient(135deg,var(--color-stone-100)_0px,var(--color-stone-100)_1px,transparent_1px,transparent_20px)] dark:bg-dark-950 dark:bg-[repeating-linear-gradient(135deg,#202020_0px,#202020_1px,transparent_1px,transparent_20px)]"
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>
