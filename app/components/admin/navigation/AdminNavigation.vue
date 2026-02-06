<script setup lang="ts">
import { BinocularsIcon, AstronautIcon, CogIcon } from "~/assets/images/icons";

// Route
const route = useRoute();
const projectId = computed(() => route.params.id as string);

// Local state
const showHelpModal = ref(false);
const showShortcutsModal = ref(false);

const handleHelpSubmitted = (data: any) => {
    console.log("Help submitted:", data);
};

const navigationItems = computed(() => [
    {
        href: `/admin/${projectId.value}`,
        label: "Discover",
        icon: BinocularsIcon,
    },
    {
        href: `/admin/${projectId.value}/design`,
        label: "Design",
        icon: AstronautIcon,
        soon: true,
        disabled: true,
    },
    {
        href: `/admin/${projectId.value}/settings`,
        label: "Settings",
        icon: CogIcon,
    },
    {
        href: `/admin/${projectId.value}/videos`,
        label: "Subscribers",
        icon: AstronautIcon,
        soon: true,
        disabled: true,
    },
]);
</script>

<template>
    <Aside>
        <template #top>
            <PageSwitcher />
        </template>

        <Navigation label="Navigation" :items="navigationItems" />

        <!-- <MainNavigation /> -->

        <template #bottom>
            <div class="w-full rounded-2xl bg-indigo-600 p-2 hidden">
                <div>Upgrade</div>
            </div>

            <FooterControls
                @openHelp="showHelpModal = true"
                @openShortcuts="showShortcutsModal = true"
            />
        </template>
    </Aside>

    <HelpModal v-model="showHelpModal" @submitted="handleHelpSubmitted" />
    <ShortcutsModal v-model="showShortcutsModal" />
</template>
