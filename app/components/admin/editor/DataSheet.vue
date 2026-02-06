<script setup lang="ts">
const props = defineProps<{
    modelValue: any[];
}>();

const emit = defineEmits(["update:modelValue"]);

const columnCount = 15;
const rowCount = 50;

const localData = computed({
    get: () => {
        // If no data, start with one empty row so user can click
        if (!props.modelValue || props.modelValue.length === 0) {
            return [{ label: "", val1: null }];
        }
        return props.modelValue;
    },
    set: (val) => emit("update:modelValue", val),
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
