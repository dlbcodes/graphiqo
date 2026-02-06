<script setup lang="ts">
import { PhQuestion } from "@phosphor-icons/vue";
import {
    TodoListIcon,
    LifebuoyIcon,
    KeyboardIcon,
} from "~/assets/images/icons";
import { buttonVariants } from "~/variants/ButtonVariants";

const emit = defineEmits(["openHelp", "openShortcuts"]);

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
        action: () => emit("openHelp"),
    },
    {
        label: "Shortcuts",
        icon: KeyboardIcon,
        action: () => emit("openShortcuts"),
    },
];
</script>

<template>
    <div class="flex items-center justify-between">
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

        <AvatarDropdown />
    </div>
</template>
