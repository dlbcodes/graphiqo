<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const props = defineProps<{
    modelValue: any[];
}>();

const emit = defineEmits(["update:modelValue"]);

const columnCount = 15;
const rowCount = 50;
const localRows = ref<any[]>([]);

// 1. Helper to pad the array
const prepareData = (incoming: any[]) => {
    // Clone to prevent mutating props directly
    const data = JSON.parse(JSON.stringify(incoming || []));
    while (data.length < rowCount) {
        const emptyRow: any = { label: "" };
        for (let i = 1; i <= columnCount; i++) {
            emptyRow[`val${i}`] = null;
        }
        data.push(emptyRow);
    }
    return data;
};

// 2. Initial load
localRows.value = prepareData(props.modelValue);

// 3. Debounce Logic: Sync to chart 300ms after last keystroke
let debounceTimer: any = null;

const syncToChart = () => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        const cleanedData = localRows.value.filter((row) => {
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
    }, 300); // 300ms delay for smoothness
};

// 4. Ensure cleanup
onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
});

const dataColumns = Array.from({ length: columnCount }, (_, i) => ({
    field: `val${i + 1}`,
    label: `Col ${i + 1}`,
}));
</script>

<template>
    <div class="sheet-root h-full w-full">
        <ClientOnly>
            <div class="editor-wrapper h-full">
                <vue-excel-editor
                    v-model="localRows"
                    width="100%"
                    no-footer
                    @input="syncToChart"
                    @change="syncToChart"
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
            </div>
        </ClientOnly>
    </div>
</template>
