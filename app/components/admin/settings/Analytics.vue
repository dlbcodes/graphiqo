<script setup lang="ts">
import { PhLightbulb } from "@phosphor-icons/vue";

const props = defineProps<{
    pageId: string;
    googleAnalyticsId?: string | null;
    facebookPixelId?: string | null;
}>();

const pageStore = usePageStore();

const form = ref({
    googleAnalyticsId: "",
    facebookPixelId: "",
});

watch(
    () => [props.googleAnalyticsId, props.facebookPixelId],
    () => {
        form.value.googleAnalyticsId = props.googleAnalyticsId || "";
        form.value.facebookPixelId = props.facebookPixelId || "";
    },
    { immediate: true }
);

const isSaving = ref(false);

const hasChanges = computed(() => {
    return (
        form.value.googleAnalyticsId !== (props.googleAnalyticsId || "") ||
        form.value.facebookPixelId !== (props.facebookPixelId || "")
    );
});

const save = async () => {
    if (!hasChanges.value) return;

    isSaving.value = true;
    try {
        await pageStore.updatePage(props.pageId, {
            googleAnalyticsId: form.value.googleAnalyticsId.trim() || null,
            facebookPixelId: form.value.facebookPixelId.trim() || null,
        });
    } finally {
        isSaving.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-y-4">
        <Header
            title="Analytics & Tracking"
            subtitle="Add tracking codes to monitor your page’s performance"
            size="sm"
        />
        <Panel class="flex flex-col gap-y-6 p-4">
            <Field
                label="Google Analytics ID"
                hint="Your Google Analytics measurement ID (e.g. G-XXXXXXXXXX)"
            >
                <Input
                    v-model="form.googleAnalyticsId"
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                    :disabled="isSaving"
                />
            </Field>

            <Field
                label="Facebook Pixel ID"
                hint="Your Facebook Pixel ID (numeric only)"
            >
                <Input
                    v-model="form.facebookPixelId"
                    placeholder="1234567890"
                    :disabled="isSaving"
                />
            </Field>

            <div class="flex justify-end">
                <Button @click="save" :disabled="!hasChanges || isSaving">
                    {{ isSaving ? "Saving…" : "Save Analytics Settings" }}
                </Button>
            </div>

            <template #footer>
                <div class="flex items-center gap-x-2 px-4 py-2">
                    <PhLightbulb class="size-4 shrink-0" />
                    <p class="text-sm text-stone-600">
                        These tracking codes are automatically injected into
                        your public page.
                    </p>
                </div>
            </template>
        </Panel>
    </div>
</template>
