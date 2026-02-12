<script setup lang="ts">
import { LinkIcon, PlayIcon, EyeIcon } from "~/assets/images/icons";

const submit = () => {
    console.log("cenas");
};
</script>

<template>
    <!-- Hero -->
    <section
        class="flex flex-col justify-center items-center gap-y-6 max-w-4xl mx-auto pt-6 pb-10"
    >
        <!-- Eyebrow -->
        <a
            href="https://liqo.app/daniel"
            target="_blank"
            class="flex flex-col shrink-0 w-fit p-1 justify-center bg-stone-100 border border-stone-200 rounded-3xl shadow-xs overflow-hidden dark:bg-dark-900 dark:border-black dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)]"
        >
            <div
                class="group flex items-center h-full px-4 p-0.5 bg-stone-50 shadow-xs rounded-[20px] dark:bg-dark-950 dark:border dark:border-black dark:shadow-[inset_-1px_1px_2px_0px_rgba(71,71,71,0.56)] overflow-visible text-stone-950 dark:text-dark-100"
            >
                <img :src="EyeIcon" alt="Flame icon" class="size-8 shrink-0" />
                <span class="text-sm font-sans font-semibold">
                    See liqo in action
                </span>
                <AnimatedArrow />
            </div>
        </a>
        <!-- End Eyebrow -->

        <!-- Title -->
        <div
            class="flex flex-col justify-between items-center text-center gap-y-4"
        >
            <h1
                class="text-center text-5xl tracking-tighter md:text-6xl lg:text-7xl font-bold text-stone-950 dark:text-dark-100"
            >
                Create stunning <br />
                charts in
                <span class="relative inline-block">
                    <span class="relative z-10">seconds.</span>
                    <span
                        class="absolute inset-0 bg-amber-300 -skew-y-2 transform z-0 -inset-x-2 inset-y-1"
                    ></span>
                </span>
            </h1>
            <p class="text-balance text-stone-600 dark:text-dark-400">
                No clutter. No complexity. Just powerful, instant chart creation
                that makes you look like a data genius.
            </p>
        </div>
        <!-- End Title -->

        <div class="flex items-center gap-x-2">
            <Button to="/waitlist" class="w-fit rounded-4xl" size="xl">
                Join waitlist!
                <AnimatedArrow />
            </Button>
        </div>

        <div class="pt-10">
            <Panel class="p-0 max-w-5xl">
                <!-- Light mode image -->
                <NuxtImg
                    provider="cloudfront"
                    src="/static/editor-light.png"
                    alt="Dashboard Light"
                    class="block dark:hidden w-full"
                />

                <!-- Dark mode image -->
                <NuxtImg
                    provider="cloudfront"
                    src="/static/editor-light.png"
                    alt="Dashboard Dark"
                    class="hidden dark:block w-full"
                />
            </Panel>
        </div>
    </section>
    <!-- End Hero -->
</template>
