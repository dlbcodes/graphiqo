<script setup lang="ts">
import { PhImage, PhGlobe, PhX } from "@phosphor-icons/vue";
import { buttonVariants } from "~/variants/ButtonVariants";
import {
    THUMBNAIL_TYPE,
    type PageLink,
    type ThumbnailType,
} from "@/types/page";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps<{
    link: PageLink;
    pageId: string;
}>();

const emit = defineEmits<{
    close: [];
    save: [data: { thumbnailType: ThumbnailType }];
}>();

const selectedType = ref<ThumbnailType>(
    props.link.thumbnailType || THUMBNAIL_TYPE.NONE
);

const debouncedEmit = useDebounceFn((type: ThumbnailType) => {
    emit("save", { thumbnailType: type });
}, 500);

const handleTypeChange = (type: ThumbnailType) => {
    selectedType.value = type;
    debouncedEmit(type);
};
</script>

<template>
    <div class="px-4 py-3">
        <div class="space-y-3">
            <div>
                <p
                    class="text-sm font-medium text-stone-700 dark:text-dark-300"
                >
                    Link Thumbnail
                </p>
                <p class="text-xs text-stone-600 dark:text-dark-400 mt-1">
                    Choose how to display this link's thumbnail
                </p>
            </div>

            <!-- Thumbnail Type Selection -->
            <div class="grid grid-cols-3 gap-2">
                <button
                    @click="
                        handleTypeChange(THUMBNAIL_TYPE.NONE as ThumbnailType)
                    "
                    :class="
                        cn(
                            'px-3 py-2 text-sm border rounded-lg transition-colors flex items-center justify-center gap-x-1.5',
                            selectedType === THUMBNAIL_TYPE.NONE
                                ? 'border-stone-900 dark:border-dark-100 bg-stone-900 dark:bg-dark-100 text-white dark:text-dark-900'
                                : 'border-stone-300 dark:border-dark-600 hover:border-stone-400 dark:hover:border-dark-500 text-stone-700 dark:text-dark-300'
                        )
                    "
                >
                    <PhX class="size-4" />
                    None
                </button>
                <button
                    @click="
                        handleTypeChange(
                            THUMBNAIL_TYPE.FAVICON as ThumbnailType
                        )
                    "
                    :class="
                        cn(
                            'px-3 py-2 text-sm border rounded-lg transition-colors flex items-center justify-center gap-x-1.5',
                            selectedType === THUMBNAIL_TYPE.FAVICON
                                ? 'border-stone-900 dark:border-dark-100 bg-stone-900 dark:bg-dark-100 text-white dark:text-dark-900'
                                : 'border-stone-300 dark:border-dark-600 hover:border-stone-400 dark:hover:border-dark-500 text-stone-700 dark:text-dark-300'
                        )
                    "
                >
                    <PhGlobe class="size-4" />
                    Favicon
                </button>
                <button
                    @click="
                        handleTypeChange(THUMBNAIL_TYPE.CUSTOM as ThumbnailType)
                    "
                    :class="
                        cn(
                            'px-3 py-2 text-sm border rounded-lg transition-colors flex items-center justify-center gap-x-1.5',
                            selectedType === THUMBNAIL_TYPE.CUSTOM
                                ? 'border-stone-900 dark:border-dark-100 bg-stone-900 dark:bg-dark-100 text-white dark:text-dark-900'
                                : 'border-stone-300 dark:border-dark-600 hover:border-stone-400 dark:hover:border-dark-500 text-stone-700 dark:text-dark-300'
                        )
                    "
                >
                    <PhImage class="size-4" />
                    Custom
                </button>
            </div>

            <!-- Type Descriptions -->
            <div
                class="text-xs text-stone-600 dark:text-dark-400 bg-stone-100 dark:bg-dark-900 rounded-lg p-2"
            >
                <p v-if="selectedType === THUMBNAIL_TYPE.NONE">
                    No thumbnail will be displayed for this link
                </p>
                <p v-else-if="selectedType === THUMBNAIL_TYPE.FAVICON">
                    The website's favicon will be automatically fetched and
                    displayed
                </p>
                <p v-else-if="selectedType === THUMBNAIL_TYPE.CUSTOM">
                    A custom thumbnail image will be displayed
                </p>
            </div>
        </div>
    </div>
</template>
