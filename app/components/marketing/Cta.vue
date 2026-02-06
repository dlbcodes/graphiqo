<script setup lang="ts">
import { AlertIcon } from "~/assets/images/icons";
import { PhSpotifyLogo, PhXLogo } from "@phosphor-icons/vue";

const names = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Ethan",
    "Fiona",
    "George",
    "Hannah",
    "Ian",
    "Jasmine",
    "Kevin",
    "Luna",
    "Mason",
    "Nina",
    "Oscar",
    "Paula",
    "Quinn",
    "Riley",
    "Sophia",
    "Tyler",
];

const currentText = ref("");
const currentIndex = ref(0);
const isDeleting = ref(false);
const typingSpeed = 150;
const deletingSpeed = 75;
const pauseTime = 1500;

function typeWriter() {
    const fullText = names[currentIndex.value];

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
        currentIndex.value = (currentIndex.value + 1) % names.length;
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
            <h1
                class="flex justify-center text-center text-xl md:text-2xl lg:text-3xl font-semibold"
            >
                One link. Way more expressive.
            </h1>
            <p
                class="text-center text-base font-light text-stone-700 leading-6"
            >
                Turn your bio link into a story experience.
            </p>
        </div>

        <div
            class="flex flex-col gap-y-10 items-center justify-center py-10 md:py-0 bg-stone-50 border-2 border-black/5 rounded-3xl max-w-6xl w-full aspect-[2.2/1] mb-20 relative"
        >
            <Brand />
            <!-- Username Animation -->
            <div class="flex items-center justify-center gap-1">
                <h1
                    class="flex text-left text-stone-400 text-3xl md:text-4xl lg:text-5xl font-normal"
                >
                    liqo.app/
                </h1>
                <p
                    class="flex text-left text-black text-3xl md:text-4xl lg:text-5xl font-normal border-r-2 border-black pr-1 select-none w-fit"
                >
                    {{ currentText }}
                </p>
            </div>
            <!-- End Username Animation -->

            <!-- CTA Button -->
            <div class="flex flex-col items-center justify-center gap-y-2">
                <Button to="/waitlist" class="w-fit rounded-4xl" size="xl">
                    Create your Liqo for free
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
            <!-- End CTA Button -->
        </div>
    </section>
</template>
