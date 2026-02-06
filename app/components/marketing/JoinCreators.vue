<script setup lang="ts">
import { useRouter } from "vue-router";

const avatars = [
    "https://randomuser.me/api/portraits/women/65.jpg",
    "https://randomuser.me/api/portraits/men/44.jpg",
    "https://randomuser.me/api/portraits/women/21.jpg",
    "https://randomuser.me/api/portraits/men/34.jpg",
    "https://randomuser.me/api/portraits/women/11.jpg",
    "https://randomuser.me/api/portraits/men/22.jpg",
    "https://randomuser.me/api/portraits/women/36.jpg",
    "https://randomuser.me/api/portraits/men/55.jpg",
    "https://randomuser.me/api/portraits/women/40.jpg",
    "https://randomuser.me/api/portraits/men/12.jpg",
];
</script>

<template>
    <section
        class="relative flex flex-col gap-y-2 items-center justify-center text-center"
    >
        <div class="flex flex-col">
            <h1
                class="flex justify-center text-center text-xl md:text-2xl lg:text-3xl font-semibold"
            >
                Join creators who share stories, not just links.
            </h1>
            <p
                class="text-center text-base font-light text-stone-700 leading-6"
            >
                Because showing always beats telling.
            </p>
        </div>

        <!-- Avatars Row -->
        <div
            class="flex items-center space-x-4 mt-4 overflow-x-auto max-w-full px-2"
        >
            <!-- Left side avatars - show/hide based on screen size -->
            <img
                v-for="(avatar, i) in avatars.slice(0, 5)"
                :key="'left-' + i"
                :src="avatar"
                :alt="`Avatar ${i + 1}`"
                class="size-12 rounded-full object-cover shrink-0"
                :class="{
                    'hidden sm:block': i >= 2, // Hide 3rd+ on small screens (show 2)
                    'hidden md:block': i >= 3, // Hide 4th+ on medium screens (show 3)
                    'hidden lg:block': i >= 5, // Show all 5 on large screens
                }"
            />

            <!-- Center You avatar -->
            <NuxtLink
                to="/register"
                class="size-18 rounded-full border-2 border-dashed border-black shrink-0 cursor-pointer hover:bg-stone-100 transition-colors"
                aria-label="Register"
            >
                <div
                    class="w-full h-full rounded-full border-black flex items-center justify-center text-black font-semibold select-none"
                >
                    You
                </div>
            </NuxtLink>

            <!-- Right side avatars - show/hide based on screen size -->
            <img
                v-for="(avatar, i) in avatars.slice(5, 10)"
                :key="'right-' + i"
                :src="avatar"
                :alt="`Avatar ${5 + i + 1}`"
                class="size-12 rounded-full object-cover shrink-0"
                :class="{
                    'hidden sm:block': i >= 2, // Hide 3rd+ on small screens (show 2)
                    'hidden md:block': i >= 3, // Hide 4th+ on medium screens (show 3)
                    'hidden lg:block': i >= 5, // Show all 5 on large screens
                }"
            />
        </div>
    </section>
</template>
