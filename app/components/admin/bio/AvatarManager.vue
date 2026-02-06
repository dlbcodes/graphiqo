<script setup lang="ts">
import { PhImage, PhTrash } from "@phosphor-icons/vue";

const props = defineProps<{
    pageId: string;
}>();

const pageStore = usePageStore();
const { currentPage } = storeToRefs(pageStore);

// Use the modal composable
const avatarModal = useModal();
const deleteModal = useModal();

const handleDelete = async () => {
    const success = await pageStore.deletePageAvatar(props.pageId);
    if (success) {
        deleteModal.close();
    }
};

// Only show delete option if there's an avatar
const options = computed(() => {
    const baseOptions = [
        {
            label: "Select image",
            action: () => avatarModal.open(),
            icon: PhImage,
        },
    ];

    // Only add delete option if avatar exists
    if (currentPage.value?.avatar || currentPage.value?.avatarUrl) {
        baseOptions.push({
            label: "Delete image",
            action: () => deleteModal.open(),
            icon: PhTrash,
        });
    }

    return baseOptions;
});
</script>

<template>
    <Dropdown :options="options" variant="primary" size="fit" @click.stop>
        <Avatar
            size="lg"
            :src="currentPage?.avatarUrl"
            :name="currentPage?.title"
            class="cursor-pointer"
        />
    </Dropdown>

    <AvatarModal
        v-model="avatarModal.isOpen.value"
        :pageId="pageId"
        title="Upload image"
        description="Upload a new profile image for your page"
    />

    <DeleteModal
        v-model="deleteModal.isOpen.value"
        title="Delete image"
        description="Are you sure you want to delete the current page image?"
        @confirm="handleDelete"
    />
</template>
