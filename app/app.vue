<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
    useHead({
        script: [
            {
                defer: true,
                "data-website-id": "dfid_l9OO3IpWPpuyV1AgFTicM",
                "data-domain": "liqo.app",
                src: "https://datafa.st/js/script.js",
            },
        ],
    });
}
</script>

<template>
    <div>
        <NuxtPage />

        <ClientOnly>
            <ToastProvider />
            <!-- <CookieConsent /> -->
            <Analytics v-if="isProd" />
        </ClientOnly>
    </div>
</template>
