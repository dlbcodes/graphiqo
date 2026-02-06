<script setup lang="ts">
const powered = ref(true);
</script>

<template>
    <Panel class="flex items-center justify-between p-4">
        <div>
            <span class="text-stone-600 dark:text-dark-300 text-sm">
                Footer
            </span>
            <h6 class="font-medium text-stone-900 truncate">
                Powered by liqo.app
                <Badge>Pro</Badge>
            </h6>
        </div>
        <Switch v-model="powered" :disbabled="true" />
    </Panel>
</template>
