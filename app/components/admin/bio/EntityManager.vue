<script setup lang="ts">
const props = defineProps<{
    pageId: string;
}>();

const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);

// Modal state using useModal
interface EntityData {
    title: string;
    bio: string;
}

const entityModal = useModal<EntityData>();
const isSavingEntity = ref(false);

// Computed values - with fallback to modal data for optimistic UI
const displayTitle = computed(() => {
    return entityModal.data.value?.title || currentPage.value?.title || "";
});

const displayBio = computed(() => {
    return entityModal.data.value?.bio || currentPage.value?.bio || "";
});

// Open modal with current data
const openEditModal = () => {
    entityModal.open({
        title: currentPage.value?.title || "",
        bio: currentPage.value?.bio || "",
    });
};

// Handle modal confirm
const handleModalConfirm = async (data: { title: string; bio: string }) => {
    if (!data.title.trim()) return;

    isSavingEntity.value = true;

    try {
        await pageStore.updatePage(props.pageId, {
            title: data.title.trim(),
            bio: data.bio.trim(),
        });

        await pageStore.fetchPage(props.pageId);
        entityModal.close();
    } catch (error) {
        console.error("Failed to update profile:", error);
        // On error, modal stays open so user can retry
    } finally {
        isSavingEntity.value = false;
    }
};
</script>

<template>
    <div @click="openEditModal" class="group flex flex-col cursor-pointer">
        <p class="font-medium group-hover:underline">
            {{ displayTitle }}
        </p>
        <p
            class="text-stone-600 dark:text-stone-400 text-sm group-hover:underline"
        >
            {{ displayBio }}
        </p>
    </div>

    <EntityModal
        v-model="entityModal.isOpen.value"
        modalTitle="Title and bio"
        :title="entityModal.data.value?.title || ''"
        :bio="entityModal.data.value?.bio || ''"
        :isLoading="isSavingEntity"
        @confirm="handleModalConfirm"
        @cancel="entityModal.close"
    />
</template>
