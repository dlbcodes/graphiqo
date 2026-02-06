<script setup lang="ts"></script>

<template>
    <div class="h-screen">
        <!-- <Separator /> -->
        <div>
            <div class="flex items-center justify-between py-10 px-12">
                <Logo />
            </div>
            <div
                class="flex flex-col justify-center gap-y-12 max-w-4xl md:min-w-2xl md:max-w-2xl p-10 lg:p-12 mx-auto"
            >
                <slot></slot>
            </div>
        </div>

        <!-- <Separator /> -->
    </div>
</template>
