<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore";
import type { CreatePageDto } from "~/types/page";
import {
    MagnifyingGlassIcon,
    ArtistPaletteIcon,
    InfoIcon,
} from "~/assets/images/icons";

definePageMeta({
    middleware: "admin",
});

const router = useRouter();
const pageStore = usePageStore();

const step = ref(1);
const isCreating = ref(false);

const steps = [
    { label: "Basic Info", icon: InfoIcon },
    { label: "Appearance", icon: ArtistPaletteIcon },
    { label: "Review", icon: MagnifyingGlassIcon },
];

const form = ref<CreatePageDto>({
    slug: "",
    title: "",
    bio: "",
    avatar: undefined,
    theme: "dark",
    primaryColor: "#4f39f6",
});

// Auto-generate slug from title
watch(
    () => form.value.title,
    (newTitle) => {
        if (newTitle) {
            form.value.slug = newTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
        }
    },
);

const createPage = async () => {
    isCreating.value = true;

    try {
        const newPage = await pageStore.createPage(form.value);

        if (newPage) {
            router.push(`/admin/${newPage.id}`);
        }
    } catch (error) {
        console.error("Failed to create page:", error);
    } finally {
        isCreating.value = false;
    }
};

const nextStep = () => step.value++;
const previousStep = () => step.value--;
</script>

<template>
    <div class="min-h-screen flex items-center justify-center p-6 bg-stone-50">
        <div class="max-w-2xl w-full">
            <OnboardingHeader />

            <Panel class="px-10 py-4">
                <OnboardingStepIndicator :current-step="step" :steps="steps" />
                <OnboardingStepBasicInfo
                    v-if="step === 1"
                    v-model:title="form.title"
                    v-model:slug="form.slug"
                    @next="nextStep"
                />

                <OnboardingStepAppearance
                    v-if="step === 2"
                    v-model:theme="form.theme"
                    v-model:primary-color="form.primaryColor"
                    @back="previousStep"
                    @next="nextStep"
                />

                <OnboardingStepReview
                    v-if="step === 3"
                    :form="form"
                    :is-creating="isCreating"
                    @back="previousStep"
                    @create="createPage"
                />
            </Panel>
        </div>
    </div>
</template>
