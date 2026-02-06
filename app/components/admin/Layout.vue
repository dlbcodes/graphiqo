<script setup lang="ts"></script>

<template>
    <div
        class="grid h-full"
        :class="[
            $slots.preview
                ? 'md:grid-cols-1'
                : 'md:grid-cols-[minmax(314px,1fr)_minmax(180px,280px)] lg:grid-cols-[minmax(484px,1fr)_minmax(200px,400px)] xl:grid-cols-[minmax(570px,1fr)_minmax(200px,460px)]',
        ]"
    >
        <!-- Main Content Column -->
        <div
            class="flex flex-col gap-y-10 h-full overflow-y-auto pt-10 pb-20 px-8 no-scrollbar"
        >
            <slot name="content" />
        </div>

        <!-- Preview Column (conditionally rendered) -->
        <div
            v-if="!$slots.preview"
            class="relative flex justify-center items-center h-screen max-h-screen bg-stone-100 dark:bg-dark-900"
        >
            <slot name="preview" />
        </div>
    </div>
</template>
