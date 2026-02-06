<script setup lang="ts">
import { getSocialPlatformIcon } from "~/utils/socialPlatforms";

interface Props {
    primaryCta: any;
    secondaryCtas: any[];
    primaryColor: string;
    socialLinks: any[];
}

defineProps<Props>();

const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
};
</script>

<template>
    <div class="flex flex-col items-center gap-y-4 pb-safe pointer-events-auto">
        <button
            v-if="primaryCta"
            class="w-full flex items-center justify-center gap-x-3 px-6 py-3.5 rounded-2xl text-center font-semibold text-white shadow-lg active:scale-95 transition-transform bg-white/20 backdrop-blur-sm"
            @click.stop="handleLinkClick(primaryCta.url)"
        >
            <span
                class="size-8 flex items-center justify-center rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
            >
                <img
                    :src="`https://www.google.com/s2/favicons?domain=${primaryCta.url}&sz=48`"
                    alt="Favicon"
                    class="shrink-0"
                />
            </span>
            <span>
                {{ primaryCta.title }}
            </span>
        </button>
        <button
            v-for="cta in secondaryCtas"
            :key="cta.id"
            class="w-full bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg text-sm text-white active:scale-95 transition-transform"
            @click.stop="handleLinkClick(cta.url)"
        >
            {{ cta.title }}
        </button>

        <!-- Social Links -->
        <div
            v-if="socialLinks.length"
            class="flex justify-center gap-3 flex-wrap mt-2"
        >
            <button
                v-for="s in socialLinks"
                :key="s.id"
                class="bg-white/10 backdrop-blur-sm p-2.5 rounded-full active:scale-90 transition-transform"
                @click.stop="handleLinkClick(s.url)"
            >
                <component
                    :is="getSocialPlatformIcon(s.platform)"
                    class="size-5 text-white"
                />
            </button>
        </div>
    </div>
</template>

<style scoped>
.pb-safe {
    padding-bottom: max(2.5rem, env(safe-area-inset-bottom));
}
</style>
