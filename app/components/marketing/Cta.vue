<script setup lang="ts">
import { AlertIcon } from "~/assets/images/icons";
import { PhSpotifyLogo, PhXLogo } from "@phosphor-icons/vue";

const words = [
    "marketing reports",
    "sales reports",
    "campaign results",
    "client dashboards",
    "ad performance",
    "content performance",
    "newsletter stats",
    "social growth charts",
    "weekly summaries",
    "project updates",
];

const currentText = ref("");
const currentIndex = ref(0);
const isDeleting = ref(false);
const typingSpeed = 150;
const deletingSpeed = 75;
const pauseTime = 1500;

function typeWriter() {
    const fullText = words[currentIndex.value];

    if (!isDeleting.value) {
        currentText.value = fullText.substring(0, currentText.value.length + 1);
    } else {
        currentText.value = fullText.substring(0, currentText.value.length - 1);
    }

    let timeout = isDeleting.value ? deletingSpeed : typingSpeed;

    if (!isDeleting.value && currentText.value === fullText) {
        timeout = pauseTime;
        isDeleting.value = true;
    } else if (isDeleting.value && currentText.value === "") {
        isDeleting.value = false;
        currentIndex.value = (currentIndex.value + 1) % words.length;
        timeout = 500;
    }

    setTimeout(typeWriter, timeout);
}

onMounted(() => {
    typeWriter();
});
</script>

<template>
    <section
        class="relative flex flex-col gap-y-6 items-center justify-center text-center"
    >
        <div class="flex flex-col">
            <!-- STATIC TITLE -->
            <h1
                class="flex justify-center text-center text-xl md:text-2xl lg:text-3xl font-semibold"
            >
                Make your data look good, fast.
            </h1>

            <!-- STATIC SUBTITLE -->
            <p
                class="text-center text-base font-light text-stone-700 leading-6"
            >
                Turn your data into clean, interactive visuals anyone can
                explore.
            </p>
        </div>

        <div
            class="flex flex-col gap-y-10 items-center justify-center py-10 md:py-0 bg-stone-50 border-2 border-black/5 rounded-3xl max-w-6xl w-full aspect-[2.2/1] mb-20 relative"
        >
            <Brand />

            <!-- ANIMATION (ONLY THIS MOVES) -->
            <div class="flex items-center justify-center gap-1">
                <h1
                    class="flex text-left text-stone-400 text-3xl md:text-4xl lg:text-5xl font-normal"
                >
                    Build better
                </h1>
                <p
                    class="flex text-left text-black text-3xl md:text-4xl lg:text-5xl font-normal border-r-2 border-black pr-1 select-none w-fit"
                >
                    {{ currentText }}
                </p>
            </div>
            <!-- END ANIMATION -->

            <!-- CTA -->
            <div class="flex flex-col items-center justify-center gap-y-2">
                <Button to="/create" class="w-fit rounded-4xl" size="xl">
                    Create your first chart in seconds
                    <AnimatedArrow />
                </Button>
                <span
                    class="flex items-center gap-x-1 text-sm font-mono font-medium tracking-tight text-stone-700 mt-2"
                >
                    <img
                        :src="AlertIcon"
                        alt="Alert icon"
                        class="size-5 shrink-0 select-none"
                    />
                    No credit card required!
                </span>
            </div>
            <!-- END CTA -->
        </div>
    </section>
</template>
