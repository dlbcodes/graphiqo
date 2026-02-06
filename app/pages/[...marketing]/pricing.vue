<script setup lang="ts">
import {
    RocketIcon,
    SproutIcon,
    ExperimentTubeIcon,
    QuestionMarkIcon,
    PriceTagIcon,
} from "~/assets/images/icons";
import { faqs } from "~/config/marketing";

usePageMeta({ title: "Pricing" });
definePageMeta({ layout: "marketing", middleware: "guest" });

const plans = {
    pro: {
        icon: RocketIcon,
        title: "Pro",
        subtitle:
            "For serious creators and brands. Remove the Liqo branding, use custom domains, and get deep analytics into every tap of your story journey.",
        price: "10",
        unit: "/month",
        cta: "Start 14-day free trial",
        features: [
            "Unlimited stories",
            "Remove Liqo branding",
            "Custom domain support",
            "Advanced tap-through analytics",
            "Custom fonts & colors",
            "Priority support",
        ],
    },
    starter: {
        icon: SproutIcon,
        title: "Starter",
        subtitle: "Perfect for growing your personal brand across platforms.",
        price: "6",
        unit: "/month",
        cta: "Start free trial",
        features: [
            "5 active stories",
            "Basic branding customization",
            "3 months data retention",
            "Standard analytics",
        ],
    },
    free: {
        icon: ExperimentTubeIcon,
        title: "Just to see",
        subtitle: "Test the story format and see how your audience reacts.",
        price: "0",
        unit: "/month",
        cta: "Get started for free",
        features: [
            "1 active story",
            "Liqo watermark",
            "7 days data retention",
            "Basic view counts",
        ],
    },
};
</script>

<template>
    <NuxtLayout>
        <section
            class="flex flex-col gap-y-16 justify-center text-center max-w-5xl mx-auto"
        >
            <div class="flex flex-col items-center justify-center gap-y-4">
                <div
                    class="flex items-center gap-x-1 font-mono w-fit px-2 py-1 rounded-2xl bg-white shadow-xs font-semibold text-sm text-stone-900"
                >
                    <img :src="PriceTagIcon" alt="" class="size-6 shrink-0" />

                    Pricing
                </div>
                <div>
                    <h2
                        class="text-4xl font-mono font-bold text-center tracking-tight uppercase mb-2"
                    >
                        Simple pricing for serious creators.
                    </h2>
                    <p class="font-mono text-gray-600 max-w-2xl mx-auto">
                        Start for free and upgrade as your audience grows. No
                        hidden fees, just better engagement.
                    </p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6 items-stretch">
                <!-- Pro -->

                <div
                    class="flex flex-col flex-1 h-full dark [&>*:first-child]:h-full"
                >
                    <PricingCard :plan="plans.pro" />
                </div>

                <!-- Starter + Free -->
                <div class="flex flex-col gap-y-6 h-full">
                    <PricingCard :plan="plans.starter" compact />
                    <PricingCard :plan="plans.free" compact />
                </div>
            </div>
        </section>

        <section
            class="flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-4 py-16 space-y-4"
        >
            <div
                class="flex items-center gap-x-1 font-mono w-fit px-2 py-1 rounded-2xl bg-white shadow-xs font-semibold text-sm text-stone-900"
            >
                <img :src="QuestionMarkIcon" alt="" class="size-5 shrink-0" />

                FAQ's
            </div>
            <h2
                class="text-4xl font-mono font-bold text-center tracking-tight mb-8"
            >
                YOU <span class="text-stone-400">(FREQUENTLY)</span> ASK. <br />
                WE ANSWER.
            </h2>

            <Faq
                v-for="(faq, i) in faqs"
                :key="i"
                :question="faq.question"
                :answer="faq.answer"
            />
        </section>
    </NuxtLayout>
</template>
