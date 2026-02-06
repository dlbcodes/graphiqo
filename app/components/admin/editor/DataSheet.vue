<script setup lang="ts">
const props = defineProps<{
    modelValue: any[];
}>();

const emit = defineEmits(["update:modelValue"]);

const columnCount = 15;
const rowCount = 50;

// Helper to create a truly empty row
const createEmptyRow = () => {
    const row: any = { label: "" }; // Empty string for label
    for (let j = 1; j <= columnCount; j++) {
        row[`val${j}`] = null; // null renders as an empty cell in vue-excel-editor
    }
    return row;
};

const localData = computed({
    get: () => {
        const data = [...(props.modelValue || [])];

        // Pad the array up to 50 rows with empty cells
        if (data.length < rowCount) {
            const remaining = rowCount - data.length;
            for (let i = 0; i < remaining; i++) {
                data.push(createEmptyRow());
            }
        }
        return data;
    },
    set: (val) => emit("update:modelValue", val),
});

const dataColumns = computed(() => {
    return Array.from({ length: columnCount }, (_, i) => ({
        field: `val${i + 1}`,
        label: `Col ${i + 1}`,
    }));
});
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
                no-finding
            >
                <vue-excel-column
                    field="label"
                    label="Label"
                    type="string"
                    width="150px"
                    sticky
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

            <template #placeholder>
                <div
                    class="flex items-center justify-center h-full text-gray-400 italic"
                >
                    Initializing empty grid...
                </div>
            </template>
        </ClientOnly>
    </div>
</template>

<style scoped>
/* This container must grow to fill the parent's flex space */
.sheet-container {
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    min-height: 0; /* Crucial for nested flex scrolling */
    height: 100%;
    width: 100%;
}

:deep(.vue-excel-editor) {
    border: none !important;
}

/* Force the internal library wrapper to occupy 100% of the flex height */
:deep(.ve-table-wrapper) {
    height: 100% !important;
}

:deep(.ve-table) {
    border-top: 1px solid #f3f4f6;
}
</style>
