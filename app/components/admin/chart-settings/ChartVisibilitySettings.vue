<script setup lang="ts">
import { PhEye, PhNotebook, PhLink } from "@phosphor-icons/vue";

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(["update:modelValue"]);

const config = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});

const updateValue = (key: string, val: any) => {
    config.value = { ...config.value, [key]: val };
};
</script>

<template>
    <Disclosure label="Visibility & Meta">
        <template #icon>
            <PhEye class="size-4 text-stone-500" />
        </template>

        <div class="space-y-4 pt-2">
            <Switch
                :model-value="!config.hideNotes"
                @update:model-value="(val) => updateValue('hideNotes', !val)"
                class="flex justify-between"
            >
                <div class="flex items-center gap-2">
                    <PhNotebook class="size-3.5 text-stone-400" />
                    <span>Show Notes</span>
                </div>
            </Switch>

            <Switch
                :model-value="!config.hideSource"
                @update:model-value="(val) => updateValue('hideSource', !val)"
                class="flex justify-between"
            >
                <div class="flex items-center gap-2">
                    <PhLink class="size-3.5 text-stone-400" />
                    <span>Show Source</span>
                </div>
            </Switch>
        </div>
    </Disclosure>
</template>
