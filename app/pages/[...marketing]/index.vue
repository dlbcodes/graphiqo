<script setup lang="ts">
import {
    FunnelIcon,
    ZapIcon,
    DashboardIcon,
    PlugAdapaterIcon,
    CursorIcon,
    AlertIcon,
    WindIcon,
} from "~/assets/images/icons";
import {
    PhSpotifyLogo,
    PhXLogo,
    PhFacebookLogo,
    PhRedditLogo,
    PhYoutubeLogo,
    PhTidalLogo,
    PhThreadsLogo,
    PhMediumLogo,
} from "@phosphor-icons/vue";

usePageMeta();

definePageMeta({
    layout: "marketing",
    middleware: "guest",
});
</script>

<template>
    <NuxtLayout>
        <Hero />

        <Playground />

        <!-- Animation -->
        <section
            class="relative flex flex-col gap-y-6 items-center justify-center text-center"
        >
            <div
                class="flex flex-col gap-y-6 items-center justify-center text-center"
            >
                <h1
                    class="flex justify-center text-center text-balance text-black max-w-4xl text-5xl md:text-4xl lg:text-6xl font-bold leading-12 md:leading-12 lg:leading-16 static"
                >
                    People don’t screenshot spreadsheets anymore. <br />
                    They share clean visuals.
                </h1>
                <p
                    class="text-center max-w-[820px] text-xl md:text-2xl lg:text-3xl font-light text-stone-700 leading-8 md:leading-10 lg:leading-12"
                >
                    Graphiqo turns your data into something people actually want
                    to look at — and share.
                </p>
            </div>

            <div
                class="flex items-center space-x-4 mt-4 overflow-x-auto max-w-full px-2"
            >
                <PhMediumLogo weight="fill" class="size-12 text-black" />
                <PhXLogo class="size-12" />
                <PhFacebookLogo weight="fill" class="size-12 text-[#1877F2]" />
                <PhThreadsLogo class="size-12" />
                <PhRedditLogo weight="fill" class="size-12 text-[#FF4500]" />
                <PhYoutubeLogo weight="fill" class="size-12 text-[#ff0000]" />
                <PhTidalLogo weight="fill" class="size-12" />
            </div>
        </section>

        <JoinCreators />

        <Cta></Cta>
    </NuxtLayout>
</template>
