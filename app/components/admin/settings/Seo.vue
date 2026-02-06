<script setup lang="ts">
import { PhWarning } from "@phosphor-icons/vue";

const props = defineProps<{
    pageId: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
}>();

const pageStore = usePageStore();

const form = ref({
    metaTitle: "",
    metaDescription: "",
});

watch(
    () => [props.metaTitle, props.metaDescription],
    () => {
        form.value.metaTitle = props.metaTitle || "";
        form.value.metaDescription = props.metaDescription || "";
    },
    { immediate: true }
);

const isSaving = ref(false);

const hasChanges = computed(() => {
    return (
        form.value.metaTitle !== (props.metaTitle || "") ||
        form.value.metaDescription !== (props.metaDescription || "")
    );
});

const save = async () => {
    if (!hasChanges.value) return;

    isSaving.value = true;
    try {
        await pageStore.updatePage(props.pageId, {
            metaTitle: form.value.metaTitle.trim() || null,
            metaDescription: form.value.metaDescription.trim() || null,
        });
    } finally {
        isSaving.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-y-4">
        <Header
            title="SEO"
            subtitle="Optimize your page for search engines"
            size="sm"
        />
        <Panel class="flex flex-col gap-y-6 p-4">
            <!-- Meta title -->
            <Field
                id="meta-title"
                label="Meta Title"
                placeholder="John Doe – Creator"
                maxlength="100"
                :disabled="isSaving"
            >
                <Input v-model="form.metaTitle" />
                <template #hint>
                    <span class="text-xs text-stone-500">
                        {{ form.metaTitle.length }}/100
                    </span>
                </template>
            </Field>

            <!-- Meta description -->
            <Field
                id="meta-description"
                label="Meta Description"
                rows="3"
                maxlength="200"
            >
                <Textarea v-model="form.metaDescription" />
                <template #hint>
                    <span class="text-xs text-stone-500">
                        {{ form.metaDescription.length }}/200
                    </span>
                </template>
            </Field>

            <div class="flex justify-end">
                <Button :disabled="!hasChanges || isSaving" @click="save">
                    {{ isSaving ? "Saving…" : "Save SEO Settings" }}
                </Button>
            </div>

            <template #footer>
                <div class="flex items-center gap-x-2 px-4 py-2">
                    <PhWarning class="size-4 shrink-0" />
                    <p class="text-sm text-stone-600">
                        Changes to metadata may take some time to appear on
                        other platforms.
                    </p>
                </div>
            </template>
        </Panel>
    </div>
</template>
