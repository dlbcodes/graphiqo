<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        to?: string;
        class?: string;
    }>(),
    {
        to: "/",
    },
);
</script>

<template>
    <div
        :class="
            cn(
                'flex items-center gap-x-1 h-6 size-12 text-black dark:text-white',
                props.class,
            )
        "
    >
        <svg
            viewBox="0 0 40 40"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
        >
            <defs>
                <linearGradient
                    x1="95.0046446%"
                    y1="5.37460513%"
                    x2="4.51491367%"
                    y2="93.5167402%"
                    id="linearGradient-1"
                >
                    <stop stop-color="#FEB60E" offset="0%"></stop>
                    <stop stop-color="#FF46ED" offset="100%"></stop>
                </linearGradient>
            </defs>
            <g
                id="Artboard"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
            >
                <path
                    d="M33,2 C36.3137085,2 39,4.6862915 39,8 L39,26.525 C39,29.8387085 36.3137085,32.525 33,32.525 L32.525,32.525 L32.525,33 C32.525,36.3137085 29.8387085,39 26.525,39 L8,39 C4.6862915,39 2,36.3137085 2,33 L2,14.475 C2,11.1612915 4.6862915,8.475 8,8.475 L8.474,8.474 L8.475,8 C8.475,4.6862915 11.1612915,2 14.475,2 L33,2 Z"
                    id="Combined-Shape"
                    fill="url(#linearGradient-1)"
                ></path>
            </g>
        </svg>
    </div>
</template>
