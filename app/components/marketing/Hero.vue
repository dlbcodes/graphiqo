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
                class="z-10 text-black font-[700] text-center tracking-[-0.125rem] order-0 min-w-auto max-w-[760px] mt-4 mb-6 text-[60px] leading-[72px] relative"
            >
                <span class="flex items-center justify-center tracking-tighter">
                    Your links
                    <img
                        :src="LinkIcon"
                        alt=""
                        class="size-12 md:size-20 shrink-0"
                    />
                </span>
                <span class="flex items-center justify-center tracking-tighter">
                    told as stories
                    <img
                        :src="PlayIcon"
                        alt=""
                        class="size-12 md:size-20 shrink-0"
                    />
                </span>
            </h1>
            <p class="text-balance text-stone-600 dark:text-dark-400">
                Liqo is a link-in-bio tool that lets you share links through
                videos and images, just like stories.
            </p>
        </div>
        <!-- End Title -->

        <div class="flex items-center gap-x-2">
            <Button to="/register" class="w-fit rounded-4xl" size="xl">
                Create your Liqo
                <AnimatedArrow />
            </Button>
        </div>

        <div class="hidden md:flex justify-center items-center">
            <div
                class="w-72 aspect-9/16 bg-stone-200 rounded-3xl overflow-hidden scale-75"
            >
                <video
                    src="https://d1awd69t1ppqjh.cloudfront.net/static/marketing/liqo-example-1.mp4"
                    muted
                    @mouseenter="(e) => (e.target as HTMLVideoElement).play()"
                    @mouseleave="(e) => (e.target as HTMLVideoElement).pause()"
                    loop
                    playsinline
                    webkit-playsinline
                    class="w-full h-full object-cover"
                />
            </div>
            <div
                class="w-72 aspect-9/16 bg-stone-200 rounded-3xl overflow-hidden"
            >
                <video
                    src="https://d1awd69t1ppqjh.cloudfront.net/static/marketing/liqo-example-1.mp4"
                    muted
                    @mouseenter="(e) => (e.target as HTMLVideoElement).play()"
                    @mouseleave="(e) => (e.target as HTMLVideoElement).pause()"
                    loop
                    playsinline
                    webkit-playsinline
                    class="w-full h-full object-cover"
                />
            </div>
            <div
                class="w-72 aspect-9/16 bg-stone-200 rounded-3xl overflow-hidden scale-75"
            >
                <video
                    src="https://d1awd69t1ppqjh.cloudfront.net/static/marketing/liqo-example-1.mp4"
                    muted
                    @mouseenter="(e) => (e.target as HTMLVideoElement).play()"
                    @mouseleave="(e) => (e.target as HTMLVideoElement).pause()"
                    loop
                    playsinline
                    webkit-playsinline
                    class="w-full h-full object-cover"
                />
            </div>
        </div>
    </section>
    <!-- End Hero -->
</template>
