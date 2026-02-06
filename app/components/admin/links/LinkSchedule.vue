<script setup lang="ts">
import { buttonVariants } from "~/variants/ButtonVariants";
import type { PageLink } from "@/types/page";

const props = defineProps<{
    link: PageLink;
}>();

const emit = defineEmits<{
    close: [];
    save: [
        data: { scheduledStartAt: string | null; scheduledEndAt: string | null }
    ];
}>();

const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
};

const startDate = ref(formatDateForInput(props.link.scheduledStartAt));
const endDate = ref(formatDateForInput(props.link.scheduledEndAt));

const toIsoUtc = (value: string | null): string | null => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString();
};

const handleSave = () => {
    emit("save", {
        scheduledStartAt: toIsoUtc(startDate.value),
        scheduledEndAt: toIsoUtc(endDate.value),
    });
};

const handleRemove = () => {
    emit("save", {
        scheduledStartAt: null,
        scheduledEndAt: null,
    });
};
</script>

<template>
    <div class="px-4 py-3">
        <div class="space-y-3">
            <p class="text-sm font-medium text-stone-700 dark:text-dark-300">
                Schedule Link Visibility
            </p>
            <p class="text-xs text-stone-600 dark:text-dark-400">
                Control when this link is visible to visitors
            </p>

            <div class="grid grid-cols-2 gap-x-8">
                <div>
                    <label
                        class="text-xs font-medium text-stone-700 dark:text-dark-300 mb-1 block"
                    >
                        Start Date & Time
                    </label>
                    <input
                        v-model="startDate"
                        type="datetime-local"
                        class="w-full px-3 py-2 text-sm border border-stone-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-900 text-stone-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-dark-500"
                    />
                    <p class="text-xs text-stone-500 dark:text-dark-500 mt-1">
                        Link will become visible at this time
                    </p>
                </div>
                <div>
                    <label
                        class="text-xs font-medium text-stone-700 dark:text-dark-300 mb-1 block"
                    >
                        End Date & Time (Optional)
                    </label>
                    <input
                        v-model="endDate"
                        type="datetime-local"
                        class="w-full px-3 py-2 text-sm border border-stone-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-900 text-stone-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-dark-500"
                    />
                    <p class="text-xs text-stone-500 dark:text-dark-500 mt-1">
                        Link will be hidden after this time
                    </p>
                </div>
            </div>

            <div class="flex justify-between pt-2">
                <button
                    v-if="link.scheduledStartAt || link.scheduledEndAt"
                    @click="handleRemove"
                    :class="
                        cn(
                            buttonVariants({
                                variant: 'destructive',
                                size: 'sm',
                            }),
                            'w-fit'
                        )
                    "
                >
                    Remove Schedule
                </button>
                <div class="flex gap-x-2 ml-auto">
                    <button
                        @click="$emit('close')"
                        :class="
                            cn(
                                buttonVariants({
                                    variant: 'secondary',
                                    size: 'sm',
                                })
                            )
                        "
                    >
                        Cancel
                    </button>
                    <button
                        @click="handleSave"
                        :class="
                            cn(
                                buttonVariants({
                                    variant: 'primary',
                                    size: 'sm',
                                })
                            )
                        "
                    >
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
