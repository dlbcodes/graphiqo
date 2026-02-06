<script setup lang="ts">
interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

import lineIcon from "~/assets/images/linechart.png";
import barIcon from "~/assets/images/barchart.png";
import mixedIcon from "~/assets/images/mixedchart.png";
import { FunnelChartIcon, EyeIcon } from "~/assets/images/icons";
import { CheckIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import type { ChartType } from "~/types/chart";

// Route & Router
const route = useRoute();
const router = useRouter();
const projectId = computed(() => route.params.id as string);

// Composable
const {
    form,
    availableEventTypes,
    isLoading,
    isSaving,
    error,
    validationErrors,
    hasEventTypes,
    isFormValid,
    fetchEventTypes,
    createChart,
    resetForm,
} = useChartCreation(projectId.value);

// Local state
const currentStep = ref(1);

// Chart type options
const chartTypeOptions = [
    {
        name: "Line chart",
        value: "line" as ChartType,
        image: lineIcon,
        description: "Show trends over time",
    },
    {
        name: "Bar chart",
        value: "bar" as ChartType,
        image: barIcon,
        description: "Compare values across categories",
    },
    {
        name: "Pie chart",
        value: "pie" as ChartType,
        image: mixedIcon,
        description: "Show proportions of a whole",
    },
    {
        name: "Number",
        value: "number" as ChartType,
        image: lineIcon,
        description: "Display a single metric",
    },
];

// Steps configuration
const steps = [
    { label: "Chart details", icon: FunnelChartIcon },
    { label: "Select events", icon: EyeIcon },
];

// Methods
const nextStep = () => {
    if (currentStep.value === 1) {
        // Validate step 1
        if (!form.value.name.trim()) {
            validationErrors.value.name = "Chart name is required";
            return;
        }
        currentStep.value = 2;
    }
};

const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const handleCancel = () => {
    router.push(`/projects/${projectId.value}/charts`);
};

const handleSave = async () => {
    const result = await createChart();

    if (result.success && result.chartId) {
        // Navigate to the new chart
        router.push(`/admin/${projectId.value}/charts/${result.chartId}`);
    }
};

// Lifecycle
onMounted(async () => {
    await fetchEventTypes();
});
</script>

<template>
    <Modal
        :modelValue="modelValue"
        size="full"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
        <div class="w-full px-4 max-w-2xl mx-auto overflow-y-auto">
            <!-- Error Message -->
            <div
                v-if="error"
                class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
                <div class="flex items-center">
                    <svg
                        class="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    <span>{{ error }}</span>
                </div>
            </div>

            <!-- Progress Steps -->
            <div class="flex justify-center items-center gap-1 mb-8">
                <template v-for="(step, index) in steps" :key="step.label">
                    <!-- Step -->
                    <button
                        @click="currentStep = index + 1"
                        :disabled="index + 1 > currentStep"
                        class="flex items-center gap-x-2 px-4 py-2 transition-opacity"
                        :class="{
                            'opacity-100': currentStep >= index + 1,
                            'opacity-50': currentStep < index + 1,
                            'cursor-pointer hover:opacity-80':
                                index + 1 <= currentStep,
                            'cursor-not-allowed': index + 1 > currentStep,
                        }"
                    >
                        <img
                            :src="step.icon"
                            :alt="`${step.label} icon`"
                            class="size-6"
                        />
                        <span class="font-medium text-sm text-stone-900">
                            {{ step.label }}
                        </span>

                        <CheckIcon
                            v-if="currentStep > index + 1"
                            class="size-4 stroke-3 text-green-600"
                        />
                    </button>

                    <!-- Chevron (except after last item) -->
                    <ChevronRightIcon
                        v-if="index < steps.length - 1"
                        class="size-5 text-stone-400"
                    />
                </template>
            </div>

            <!-- Loading State -->
            <div
                v-if="isLoading"
                class="flex items-center justify-center py-12"
            >
                <Spinner />
            </div>

            <!-- STEP 1: Chart Details -->
            <ChartDetailsForm
                v-else-if="currentStep === 1"
                :form="form"
                :chart-type-options="chartTypeOptions"
                :errors="validationErrors"
                @next="nextStep"
                @cancel="handleCancel"
            />

            <!-- STEP 2: Event Selection -->
            <ChartEventSelector
                v-else-if="currentStep === 2"
                :form="form"
                :available-event-types="availableEventTypes"
                :errors="validationErrors"
                :is-saving="isSaving"
                :is-form-valid="isFormValid"
                @save="handleSave"
                @back="previousStep"
            />
        </div>
    </Modal>
</template>
