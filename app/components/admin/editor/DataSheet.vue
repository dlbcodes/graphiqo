<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const props = defineProps<{
    modelValue: any;
    chartData: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const gridRef = ref(null);
const columnCount = 15;
const rowCount = 50;

// Local State
const localRows = ref<any[]>([]);
const displayLabels = ref<Record<string, string>>({});

/* -------------------------------------------------------------------------- */
/* Init incoming data                                                         */
/* -------------------------------------------------------------------------- */
watch(
    () => props.chartData?.id,
    () => {
        const newVal = props.modelValue;

        // Init display labels
        const cols: Record<string, string> = { ...newVal?.columns };
        for (let i = 1; i <= columnCount; i++) {
            const key = `val${i}`;
            if (!cols[key]) cols[key] = `Series ${i}`;
        }
        displayLabels.value = cols;

        // Init rows with deep copy
        const data = JSON.parse(JSON.stringify(newVal?.rows || []));
        while (data.length < rowCount) {
            const emptyRow: any = { label: "" };
            for (let i = 1; i <= columnCount; i++) {
                emptyRow[`val${i}`] = null;
            }
            data.push(emptyRow);
        }
        localRows.value = data;
    },
    { immediate: true },
);

/* -------------------------------------------------------------------------- */
/* Sync logic                                                                 */
/* -------------------------------------------------------------------------- */
let debounceTimer: any = null;

const syncToChart = () => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        // Build payload using current labels and cleaned rows
        const payload = {
            columns: { ...displayLabels.value },
            rows: localRows.value
                .filter((row) => {
                    return (
                        row.label?.trim() !== "" ||
                        Object.keys(row).some(
                            (k) =>
                                k.startsWith("val") &&
                                row[k] !== null &&
                                row[k] !== "",
                        )
                    );
                })
                .map(({ $id, ...rest }) => rest), // Strip internal Excel IDs
        };

        console.log("Syncing to Prisma:", payload);
        emit("update:modelValue", payload);
    }, 100);
};

onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
});

/* -------------------------------------------------------------------------- */
/* Handle column label updates                                                */
/* -------------------------------------------------------------------------- */
const onColumnLabelUpdated = (event: any) => {
    // IMPORTANT: The library returns { name, label } NOT { field, newLabel }
    const field = event.name;
    const label = event.label;

    if (field && label !== undefined) {
        displayLabels.value[field] = label;
        syncToChart();
    }
};
</script>

<template>
    <div class="sheet-root h-full w-full bg-white dark:bg-[#0F0F0F]">
        <ClientOnly>
            <vue-excel-editor
                ref="gridRef"
                v-model="localRows"
                width="100%"
                height="100%"
                no-footer
                :allow-delete="true"
                @input="syncToChart"
                @change="syncToChart"
                @column-label-updated="onColumnLabelUpdated"
            >
                <vue-excel-column
                    field="label"
                    label="Label"
                    type="string"
                    width="120px"
                />

                <vue-excel-column
                    v-for="i in columnCount"
                    :key="`val${i}`"
                    :field="`val${i}`"
                    :label="displayLabels[`val${i}`]"
                    type="number"
                    width="100px"
                />
            </vue-excel-editor>
        </ClientOnly>
    </div>
</template>

<style scoped>
:deep(.ve-table) {
    border: none !important;
}
/* This ensures the header is double-clickable to edit */
:deep(.ve-header-cell) {
    cursor: pointer;
}
</style>
