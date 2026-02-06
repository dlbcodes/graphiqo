<script setup lang="ts">
import type { SocialLink } from "@/types/page";
import { buttonVariants } from "~/variants/ButtonVariants";
import { PhPlus } from "@phosphor-icons/vue";

const props = defineProps<{ pageId: string }>();

const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);

// ----- Modal state using useModal composable
const socialModal = useModal<SocialLink>();
const isSavingSocial = ref(false);

// ----- Source of truth
const socialLinks = computed(() => {
    if (!currentPage.value || currentPage.value.id !== props.pageId) {
        return [];
    }
    return [...(currentPage.value.socialLinks || [])].sort(
        (a, b) => a.order - b.order
    );
});

// ----- Sortable composable
const {
    container,
    items: sortableSocial,
    isSorting,
    hasUnsavedOrder,
} = useSortableOrder(socialLinks, async (orders) => {
    await $fetch(`/api/v1/pages/${props.pageId}/social-links/reorder`, {
        method: "POST",
        body: { linkOrders: orders },
    });

    await pageStore.fetchPage(props.pageId);
});

// ----- Modal computed properties
const modalTitle = computed(() =>
    socialModal.data.value ? "Edit Social Link" : "Add Social Link"
);

const modalPlatform = computed(() => socialModal.data.value?.platform || "");
const modalUrl = computed(() => socialModal.data.value?.url || "");
const isEmpty = computed(() => sortableSocial.value.length === 0);

// ----- Modal handlers using the composable
const openAddModal = () => {
    socialModal.open(); // Open without data = add mode
};

const openEditModal = (social: SocialLink) => {
    socialModal.open(social); // Open with data = edit mode
};

const handleModalConfirm = async (data: { platform: string; url: string }) => {
    if (!data.platform.trim() || !data.url.trim()) return;

    isSavingSocial.value = true;
    try {
        if (socialModal.data.value) {
            // Edit mode
            await pageStore.updateSocialLink(
                props.pageId,
                socialModal.data.value.id,
                data
            );
        } else {
            // Add mode
            await pageStore.createSocialLink(props.pageId, {
                ...data,
                order: socialLinks.value.length,
            });
        }

        await pageStore.fetchPage(props.pageId);
        socialModal.close(); // Clean close with data reset
    } finally {
        isSavingSocial.value = false;
    }
};

const handleDelete = async () => {
    if (!socialModal.data.value) return;

    isSavingSocial.value = true;
    try {
        const success = await pageStore.deleteSocialLink(
            props.pageId,
            socialModal.data.value.id
        );

        if (success) {
            await pageStore.fetchPage(props.pageId);
            socialModal.close();
        }
    } finally {
        isSavingSocial.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-y-4">
        <!-- Empty State -->
        <EmptySocial
            v-if="isEmpty"
            :disabled="isSavingSocial"
            @create="openAddModal"
        />

        <!-- Sortable List -->
        <div v-else class="flex items-center gap-x-3">
            <!-- Social Icons -->
            <div ref="container" class="flex items-center gap-x-3">
                <SocialItem
                    v-for="social in sortableSocial"
                    :key="social.id"
                    :item="social"
                    @edit="openEditModal"
                />
            </div>

            <!-- Add Button -->
            <div v-tooltip="'Add social link'" class="inline-flex">
                <button
                    class="group"
                    :class="
                        cn(
                            buttonVariants({
                                variant: 'icon',
                                size: 'icon',
                            }),
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )
                    "
                    :disabled="isSavingSocial"
                    @click="openAddModal"
                >
                    <PhPlus class="size-5" />
                </button>
            </div>
        </div>

        <!-- Sorting Indicator -->
        <SortingIndicator
            :hasUnsavedOrder="hasUnsavedOrder"
            :isSorting="isSorting"
        />
    </div>

    <!-- Social Modal -->
    <SocialModal
        v-model="socialModal.isOpen.value"
        :title="modalTitle"
        :platform="modalPlatform"
        :url="modalUrl"
        :isLoading="isSavingSocial"
        @confirm="handleModalConfirm"
        @delete="handleDelete"
        @cancel="socialModal.close"
    />
</template>
