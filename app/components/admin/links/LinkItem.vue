<script setup lang="ts">
import { PhDotsSixVertical } from "@phosphor-icons/vue";
import type { PageLink, UpdatePageLinkDto } from "@/types/page";

const props = defineProps<{
    link: PageLink;
    pageId: string;
}>();

const emit = defineEmits<{
    edit: [link: PageLink];
}>();

const pageStore = usePageStore();
const isLoading = ref(false);

// Use modal composable
const deleteModal = useModal();

const handleEdit = () => {
    emit("edit", props.link);
};

const handleUpdate = async (data: UpdatePageLinkDto) => {
    isLoading.value = true;

    try {
        await pageStore.updatePageLink(props.pageId, props.link.id, data);
        await pageStore.fetchPage(props.pageId);
    } catch (error) {
        console.error("Failed to update link:", error);
    } finally {
        isLoading.value = false;
    }
};

const handleDelete = async () => {
    isLoading.value = true;

    try {
        await pageStore.deletePageLink(props.pageId, props.link.id);
        await pageStore.fetchPage(props.pageId);
        deleteModal.close();
    } catch (error) {
        console.error("Failed to delete link:", error);
        isLoading.value = false;
    }
};
</script>

<template>
    <Panel class="flex items-center gap-x-3 px-4 py-6 transition-colors">
        <div
            class="drag-handle cursor-grab active:cursor-grabbing p-1 -m-1 hover:bg-stone-300 dark:hover:bg-dark-700 rounded transition-colors"
            title="Drag to reorder"
            aria-label="Drag to reorder link"
        >
            <PhDotsSixVertical
                class="size-5 text-stone-500 dark:text-dark-400"
            />
        </div>

        <div class="flex flex-col flex-1 min-w-0">
            <LinkContent
                :link="link"
                @edit="handleEdit"
                @toggle="handleUpdate"
            />
        </div>

        <template #footer>
            <LinkActions
                :pageId="pageId"
                :link="link"
                :isLoading="isLoading"
                @delete="deleteModal.open"
                @update-schedule="handleUpdate"
                @update-thumbnail="handleUpdate"
            />
        </template>
    </Panel>

    <DeleteModal
        v-model="deleteModal.isOpen.value"
        title="Delete link"
        :description="`Are you sure you want to delete ${link.title}?`"
        @confirm="handleDelete"
    />
</template>
