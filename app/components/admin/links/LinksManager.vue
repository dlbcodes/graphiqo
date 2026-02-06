<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/outline";
import type { PageLink } from "@/types/page";
import { storeToRefs } from "pinia";

const props = defineProps<{ pageId: string }>();

const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);

/* ---------------- Modal ---------------- */
const linkModal = useModal<PageLink>();
const isSavingLink = ref(false);

/* ---------------- Source data ---------------- */
const pageLinks = computed<PageLink[]>(() => {
    if (!currentPage.value || currentPage.value.id !== props.pageId) return [];
    return [...(currentPage.value.pageLinks || [])].sort(
        (a, b) => a.order - b.order
    );
});

/* ---------------- Sortable ---------------- */
const {
    container,
    items: sortableLinks,
    isSorting,
    hasUnsavedOrder,
} = useSortableOrder(pageLinks, async (orders) => {
    await $fetch(`/api/v1/pages/${props.pageId}/page-links/reorder`, {
        method: "POST",
        body: { linkOrders: orders },
    });

    await pageStore.fetchPage(props.pageId);
});

/* ---------------- Modal computed ---------------- */
const modalTitle = computed(() =>
    linkModal.data.value ? "Edit Link" : "Create Link"
);

const modalLabel = computed(() => linkModal.data.value?.title || "");
const modalUrl = computed(() => linkModal.data.value?.url || "");

const isEmpty = computed(() => sortableLinks.value.length === 0);

/* ---------------- Modal actions ---------------- */
const openAddModal = () => linkModal.open();

const openEditModal = (link: PageLink) => linkModal.open(link);

const handleModalConfirm = async (data: { label: string; url: string }) => {
    if (!data.label.trim() || !data.url.trim()) return;

    isSavingLink.value = true;

    try {
        if (linkModal.data.value) {
            await pageStore.updatePageLink(
                props.pageId,
                linkModal.data.value.id,
                {
                    title: data.label.trim(),
                    url: data.url.trim(),
                }
            );
        } else {
            await pageStore.createPageLink(props.pageId, {
                title: data.label.trim(),
                url: data.url.trim(),
                order: pageLinks.value.length,
            });
        }

        await pageStore.fetchPage(props.pageId);
        linkModal.close();
    } finally {
        isSavingLink.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-y-4">
        <!-- Header -->
        <LinksHeader
            :isEmpty="isEmpty"
            :isDisabled="isSavingLink"
            @add="openAddModal"
        />

        <!-- Empty State -->
        <LinksEmpty
            v-if="isEmpty"
            :isDisabled="isSavingLink"
            @add="openAddModal"
        />

        <!-- Sortable List -->
        <div v-else ref="container" class="flex flex-col gap-y-3">
            <LinkItem
                v-for="link in sortableLinks"
                :key="link.id"
                :link="link"
                :pageId="pageId"
                @edit="openEditModal"
            />
        </div>

        <!-- Sorting Indicator -->
        <SortingIndicator
            :hasUnsavedOrder="hasUnsavedOrder"
            :isSorting="isSorting"
        />

        <!-- Add Link CTA (bottom) -->
        <button
            v-if="!isEmpty"
            class="group flex items-center gap-x-2 text-sm text-stone-600 hover:text-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSavingLink"
            @click="openAddModal"
        >
            <span
                class="p-1 rounded-lg bg-stone-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-all"
            >
                <PlusIcon class="size-4 stroke-2" />
            </span>
            Add Link
        </button>

        <PoweredBy />
    </div>

    <!-- Link Modal -->
    <LinkModal
        v-model="linkModal.isOpen.value"
        :title="modalTitle"
        :label="modalLabel"
        :url="modalUrl"
        :isLoading="isSavingLink"
        @confirm="handleModalConfirm"
        @cancel="linkModal.close"
    />
</template>
