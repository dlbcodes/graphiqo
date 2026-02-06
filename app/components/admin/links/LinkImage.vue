<script setup lang="ts">
import { ref, watch } from "vue";
import { type PageLink } from "@/types/page";

const props = defineProps<{
    link: PageLink;
    pageId: string;
}>();

const localThumbnailUrl = ref<string | undefined>(
    props.link.thumbnailUrl ?? undefined
);

watch(
    () => props.link.thumbnailUrl,
    (newVal) => {
        localThumbnailUrl.value = newVal ?? undefined;
    }
);
</script>

<template>
    <FileUploadInput
        type="page-link-thumbnail"
        :pageId="pageId"
        :linkId="link.id"
        label="Thumbnail (Optional)"
        hint="JPG, PNG, or WebP • Max 5MB"
        v-model="localThumbnailUrl"
    />
</template>
