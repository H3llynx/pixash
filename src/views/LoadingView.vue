<script setup lang="ts">
import SashaPixie from '../assets/sasha-pixie.png';
import Paw from '../components/icons/Paw.vue';
</script>

<template>
    <div class="fixed inset-0 flex flex-col items-center justify-center text-center gap-3 bg-bg-loading pb-10">
        <div class="fadein-1">
            <Paw class="paw" />
        </div>
        <div class="fadein-2">
            <h1 class="text-4xl text-text-softer">Pixash</h1>
            <p class="text-sm leading-3 tracking-wider">pet care, beautifully organised
            </p>
        </div>
    </div>
    <img :src="SashaPixie" alt=""
        class="z-1 fixed -bottom-4 xl:-bottom-6.5 w-full -z-1 h-[45%] xl:h-auto object-cover" />
</template>

<style scoped>
@keyframes fadein {
    from {
        opacity: 0;
        transform: translateY(8px);
        color: var(--color-text-loading-1);
    }

    to {
        opacity: 1;
        transform: translateY(0);
        color: var(--color-text-loading-2);
    }
}

@keyframes pawpulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.3;
        transform: scale(0.88);
    }
}

.fadein-1 {
    animation: fadein 0.6s ease-out forwards 0.2s;
    opacity: 0;
}

.fadein-2 {
    animation: fadein 0.6s ease-out forwards 0.5s;
    opacity: 0;
}

.paw {
    width: 10rem;
    height: 10rem;
    animation: pawpulse 1.8s ease-in-out infinite;
    transform-origin: center;
    transform-box: fill-box;
}

img {
    filter: drop-shadow(0px 16px 60px var(--color-green));
}
</style>