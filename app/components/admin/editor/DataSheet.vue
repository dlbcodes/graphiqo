<script setup lang="ts">
const props = defineProps<{
    modelValue: any[];
}>();

const emit = defineEmits(["update:modelValue"]);

const columnCount = 15;
const rowCount = 50;

const localData = computed({
    get: () => {
        const data = props.modelValue || [];
        // If we have fewer rows than rowCount, pad with empty objects
        if (data.length < rowCount) {
            const padding = Array.from(
                { length: rowCount - data.length },
                () => ({
                    label: "",
                    // Initialize val1...val15 as null so they exist in the object
                    ...Object.fromEntries(
                        Array.from({ length: columnCount }, (_, i) => [
                            `val${i + 1}`,
                            null,
                        ]),
                    ),
                }),
            );
            return [...data, ...padding];
        }
        return data;
    },
    set: (val) => {
        // CLEANUP: When saving, filter out rows that are completely empty
        // so we don't bloat the database with 50 empty rows.
        const cleanedData = val.filter((row) => {
            return (
                row.label?.trim() !== "" ||
                Object.keys(row).some(
                    (key) =>
                        key.startsWith("val") &&
                        row[key] !== null &&
                        row[key] !== "",
                )
            );
        });
        emit("update:modelValue", cleanedData);
    },
});

const dataColumns = Array.from({ length: columnCount }, (_, i) => ({
    field: `val${i + 1}`,
    label: `Col ${i + 1}`,
}));
</script>

<template>
    <div class="sheet-container">
        <ClientOnly>
            <vue-excel-editor
                v-model="localData"
                width="100%"
                height="100%"
                remember
                no-footer
                allow-add-row
            >
                <vue-excel-column
                    field="label"
                    label="Label"
                    type="string"
                    width="150px"
                />
                <vue-excel-column
                    v-for="col in dataColumns"
                    :key="col.field"
                    :field="col.field"
                    :label="col.label"
                    type="number"
                    width="100px"
                />
            </vue-excel-editor>
        </ClientOnly>
    </div>
</template>

<style scoped>
.sheet-container {
    width: 100%;
    height: 100%;
    min-height: 0;
}

:deep(.ve-container) {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
}

:deep(.ve-table-container) {
    flex: 1 !important;
    min-height: 0 !important;
    overflow: auto !important;
}

:deep(.ve-content-container) {
    height: 100% !important;
}
</style>
