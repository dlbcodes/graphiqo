<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { PhWarning, PhArrowRight } from "@phosphor-icons/vue";
import { usePageStore } from "~/stores/pageStore";

const props = defineProps<{
    pageId: string;
    isPublished: boolean;
    isNsfw?: boolean;
    slug: string;
}>();

const pageStore = usePageStore();

const isNsfw = ref(false);
const isPublished = ref(false);

watch(
    () => props.isNsfw,
    (val) => {
        isNsfw.value = !!val;
    },
    { immediate: true }
);

watch(
    () => props.isPublished,
    (val) => {
        isPublished.value = !!val;
    },
    { immediate: true }
);

const hasNsfwChanges = computed(() => isNsfw.value !== !!props.isNsfw);
const hasPublishedChanges = computed(
    () => isPublished.value !== !!props.isPublished
);

const isSavingNsfw = ref(false);
const isSavingPublished = ref(false);

const saveNsfw = async () => {
    if (!hasNsfwChanges.value) return;

    isSavingNsfw.value = true;
    try {
        await pageStore.updatePage(props.pageId, {
            isNsfw: isNsfw.value,
        });
    } finally {
        isSavingNsfw.value = false;
    }
};

const savePublished = async () => {
    if (!hasPublishedChanges.value) return;

    isSavingPublished.value = true;
    try {
        await pageStore.updatePage(props.pageId, {
            isPublished: isPublished.value,
        });
    } finally {
        isSavingPublished.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-y-4">
        <Header
            title="Content Settings"
            subtitle="Control how your content is displayed and accessed"
            size="sm"
        />

        <Panel class="flex flex-col gap-y-6 p-4">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <p
                        class="font-medium text-stone-900 flex items-center gap-2"
                    >
                        Published
                    </p>
                    <p class="text-sm text-stone-600">
                        When published, your page is live and visible to
                        visitors.
                    </p>
                </div>

                <Switch
                    v-model="isPublished"
                    :disabled="isSavingPublished"
                    @change="savePublished"
                />
            </div>
            <div>
                <!-- NSFW Toggle -->
                <div class="flex items-start gap-3">
                    <div class="flex-1">
                        <p class="font-medium text-stone-900">
                            Mark as NSFW (Not Safe For Work)
                        </p>

                        <p class="text-sm text-stone-600">
                            Visitors will see a warning before accessing your
                            page.
                        </p>
                    </div>
                    <div>
                        <Switch
                            v-model="isNsfw"
                            :disabled="isSavingNsfw"
                            @change="saveNsfw"
                        />
                    </div>
                </div>

                <!-- NSFW Warning -->
                <div
                    v-if="isNsfw"
                    class="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4"
                >
                    <PhWarning class="size-5 text-amber-600 shrink-0" />
                    <div class="text-sm text-amber-800">
                        <p class="font-medium">NSFW Warning Enabled</p>
                        <p class="opacity-80">
                            Visitors must confirm before viewing your page.
                        </p>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex items-center gap-x-2 px-4 py-2">
                    <a
                        :href="`/${slug}`"
                        target="_blank"
                        class="inline-flex items-center gap-x-1 text-sm text-stone-600 hover:text-stone-900"
                    >
                        View public page
                        <PhArrowRight class="size-4 shrink-0" />
                    </a>
                </div>
            </template>
        </Panel>
    </div>
</template>
