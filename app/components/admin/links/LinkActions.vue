<script setup lang="ts">
import type { PageLink } from "@/types/page";
import { PhTrash, PhImage, PhClock, PhPresentation } from "@phosphor-icons/vue";
import { buttonVariants } from "~/variants/ButtonVariants";
import { THUMBNAIL_TYPE, type ThumbnailTypeValue } from "@/types/page";

const props = defineProps<{
    pageId: string;
    link: PageLink;
    isLoading: boolean;
}>();

const emit = defineEmits<{
    toggle: [];
    edit: [];
    delete: [];
    updateSchedule: [
        schedule: {
            scheduledStartAt: string | null;
            scheduledEndAt: string | null;
        }
    ];
    updateThumbnail: [thumbnail: { thumbnailType: ThumbnailTypeValue }];
}>();

const expandedOption = ref<"thumbnail" | "schedule" | "image" | null>(null);

const toggleOption = (option: "thumbnail" | "schedule" | "image") => {
    expandedOption.value = expandedOption.value === option ? null : option;
};

const handleScheduleSave = (data: {
    scheduledStartAt: string | null;
    scheduledEndAt: string | null;
}) => {
    emit("updateSchedule", data);
    expandedOption.value = null;
};

const handleThumbnailSave = (data: { thumbnailType: ThumbnailTypeValue }) => {
    emit("updateThumbnail", data);
};

const hasPresentation = computed(
    () => props.link.thumbnailType !== THUMBNAIL_TYPE.NONE
);
const hasSchedule = computed(
    () => props.link.scheduledStartAt || props.link.scheduledEndAt
);
const hasThumbnail = computed(() => props.link.thumbnailUrl);
</script>

<template>
    <div class="flex flex-col">
        <div class="flex flex-1 items-center justify-between pt-1 px-4">
            <div class="flex items-center gap-x-3">
                <button
                    v-tooltip="'Presentation'"
                    @click="toggleOption('thumbnail')"
                    :class="
                        cn(
                            buttonVariants({ variant: 'icon', size: 'icon' }),
                            expandedOption === 'thumbnail' &&
                                'bg-stone-200 dark:bg-dark-800',
                            hasPresentation &&
                                'text-indigo-600 dark:text-indigo-600'
                        )
                    "
                >
                    <PhPresentation class="size-4.5 shrink-0" />
                </button>
                <button
                    v-tooltip="'Schedule'"
                    @click="toggleOption('schedule')"
                    :class="
                        cn(
                            buttonVariants({ variant: 'icon', size: 'icon' }),
                            expandedOption === 'schedule' &&
                                'bg-stone-200 dark:bg-dark-800',
                            hasSchedule &&
                                'text-indigo-600 dark:text-indigo-600'
                        )
                    "
                >
                    <PhClock class="size-4.5 shrink-0" />
                </button>
                <button
                    v-tooltip="'Image'"
                    @click="toggleOption('image')"
                    :class="
                        cn(
                            buttonVariants({ variant: 'icon', size: 'icon' }),
                            expandedOption === 'image' &&
                                'bg-stone-200 dark:bg-dark-800',
                            hasThumbnail &&
                                'text-indigo-600 dark:text-indigo-600'
                        )
                    "
                >
                    <PhImage class="size-4.5 shrink-0" />
                </button>
            </div>
            <div class="flex items-center gap-x-3">
                <button
                    v-tooltip="'Delete'"
                    :disabled="isLoading"
                    @click="$emit('delete')"
                    :class="
                        cn(buttonVariants({ variant: 'icon', size: 'icon' }))
                    "
                >
                    <PhTrash class="size-4.5 shrink-0" />
                </button>
            </div>
        </div>

        <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
        >
            <div v-if="expandedOption" class="overflow-hidden">
                <LinkThumbnail
                    v-if="expandedOption === 'thumbnail'"
                    :link="link"
                    :pageId="pageId"
                    @save="handleThumbnailSave"
                    @close="expandedOption = null"
                />
                <LinkSchedule
                    v-if="expandedOption === 'schedule'"
                    :link="link"
                    @close="expandedOption = null"
                    @save="handleScheduleSave"
                />
                <LinkImage
                    v-if="expandedOption === 'image'"
                    :pageId="pageId"
                    :link="link"
                    @close="expandedOption = null"
                />
            </div>
        </Transition>
    </div>
</template>
