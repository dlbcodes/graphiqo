<script setup lang="ts">
import { PhQuestion } from "@phosphor-icons/vue";
import { buttonVariants } from "~/variants/ButtonVariants";
import {
    TodoListIcon,
    LifebuoyIcon,
    KeyboardIcon,
} from "~/assets/images/icons";

const showHelp = ref(false);
const showShortcuts = ref(false);

const dropdownOptions = [
    {
        label: "Changelog",
        icon: TodoListIcon,
        disabled: true,
        action: () => {},
    },
    {
        label: "Ask help",
        icon: LifebuoyIcon,
        action: () => (showHelp.value = true),
    },
    {
        label: "Shortcuts",
        icon: KeyboardIcon,
        action: () => (showShortcuts.value = true),
    },
];
</script>

<template>
    <div class="fixed left-8 bottom-8 z-50">
        <Dropdown
            :options="dropdownOptions"
            variant="primary"
            size="3xs"
            @click.stop
        >
            <span :class="buttonVariants({ variant: 'icon', size: 'icon' })">
                <PhQuestion class="size-6 shrink-0" />
            </span>
        </Dropdown>

        <HelpModal v-model="showHelp" />
        <ShortcutsModal v-model="showShortcuts" />
    </div>
</template>
