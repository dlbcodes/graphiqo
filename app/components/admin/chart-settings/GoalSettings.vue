<script setup lang="ts">
import { computed } from "vue";
import { PhTarget } from "@phosphor-icons/vue";

const props = defineProps<{
    modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

// Writable computed to handle state changes safely
const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const updateValue = (key: string, val: any) => {
    config.value = { ...config.value, [key]: val };
};
</script>

<template>
    <Disclosure label="Goal / Target Line">
        <div class="grid grid-cols-2 gap-x-3">
            <Field
                id="goal-number"
                class="flex-1"
                label="Value"
                placeholder="100"
                type="number"
            >
                <Input
                    size="sm"
                    :model-value="config.goalValue"
                    @input="
                        (e) =>
                            updateValue(
                                'goalValue',
                                Number((e.target as HTMLInputElement).value),
                            )
                    "
                />
            </Field>

            <Field
                id="goal-label"
                class="flex-1"
                label="Label"
                placeholder="Target"
                type="text"
            >
                <Input
                    size="sm"
                    :model-value="config.goalLabel"
                    @input="
                        (e) =>
                            updateValue(
                                'goalLabel',
                                (e.target as HTMLInputElement).value,
                            )
                    "
                />
            </Field>
        </div>
    </Disclosure>
</template>
