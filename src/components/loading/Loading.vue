<template>
    <div class="flex gap-0.5 items-center">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    </div>
</template>

<style scoped>
@keyframes fadedots {

    0%,
    100% {
        opacity: 0.2;
        transform: translateY(0);
    }

    50% {
        opacity: 1;
        transform: translateY(-6px);
    }
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &:nth-of-type(1) {
        animation: fadedots 1.2s ease-in-out infinite 0s;
        background: var(--color-loading-svg-1);
    }

    &:nth-of-type(2) {
        animation: fadedots 1.2s ease-in-out infinite 0.2s;
        background: var(--color-gold);
    }

    &:nth-of-type(3) {
        animation: fadedots 1.2s ease-in-out infinite 0.4s;
        background: var(--color-loading-svg-1);
    }
}
</style>