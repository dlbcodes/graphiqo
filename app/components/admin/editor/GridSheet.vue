<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { Grid, h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const gridWrapper = ref<HTMLDivElement>();
let grid: Grid | null = null;

// 1. THE SAVE TRIGGER
// We must emit a CLONE so the parent (Prisma watcher) detects a change
const persist = () => {
    console.log("Syncing to DB:", props.modelValue);
    emit("update:modelValue", JSON.parse(JSON.stringify(props.modelValue)));
};

// 2. The Render Logic
const renderGrid = () => {
    if (!gridWrapper.value) return;

    // Use current columns from the model
    const colKeys = Object.keys(props.modelValue.columns || {});

    const columns = [
        {
            id: "label",
            name: "Label",
            formatter: (cell, row) =>
                h("input", {
                    className: "grid-input",
                    value: cell,
                    onInput: (e) => {
                        props.modelValue.rows[row.index].label = e.target.value;
                        persist();
                    },
                }),
        },
        ...colKeys.map((key) => ({
            id: key,
            // RENDER THE CURRENT NAME FROM DB
            name: props.modelValue.columns[key],
            // HEADER RENAMING LOGIC
            attributes: (cell) => {
                if (!cell) return {};
                return {
                    ondblclick: () => {
                        const currentName = props.modelValue.columns[key];
                        const newName = prompt("Rename Series:", currentName);
                        if (newName && newName !== currentName) {
                            // Update the model directly
                            props.modelValue.columns[key] = newName;
                            // Update the UI
                            renderGrid();
                            // Save to Database
                            persist();
                        }
                    },
                    title: "Double-click to rename",
                };
            },
            formatter: (cell, row) =>
                h("input", {
                    className: "grid-input",
                    type: "number",
                    value: cell,
                    onInput: (e) => {
                        props.modelValue.rows[row.index][key] = e.target.value;
                        persist();
                    },
                }),
        })),
    ];

    const data = props.modelValue.rows.map((r: any) => [
        r.label,
        ...colKeys.map((k) => r[k]),
    ]);

    if (grid) grid.destroy();

    grid = new Grid({
        columns,
        data,
        className: { table: "custom-grid-table" },
    }).render(gridWrapper.value);
};

onMounted(renderGrid);

// Only re-render when switching charts/dashboards
watch(() => props.modelValue.id, renderGrid);

onUnmounted(() => {
    if (grid) grid.destroy();
});
</script>

<template>
    <div
        class="grid-sheet h-full w-full overflow-auto p-4 bg-white dark:bg-stone-900"
    >
        <div ref="gridWrapper"></div>
    </div>
</template>

<style scoped>
:deep(.grid-input) {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
    padding: 8px;
    font-size: 13px;
    color: inherit;
}
:deep(.gridjs-td) {
    padding: 0 !important;
    border: 1px solid #eee !important;
}
.dark :deep(.gridjs-td) {
    border-color: #333 !important;
}
:deep(.gridjs-th) {
    cursor: pointer;
    user-select: none;
}
</style>
