<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue';
import puppy from '../../assets/animations/puppy-ball.json';
</script>

<template>
  <div class="flex flex-col items-center justify-center relative max-w-lg m-auto">
    <div class="spinner-ring-outer"></div>
    <div class="spinner-ring"></div>
    <LottieAnimation :animationData="puppy" :loop="true" :autoplay="true" :speed="1" />
  </div>
</template>

<style>
.spinner-ring,
.spinner-ring-outer {
  position: absolute;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

.spinner-ring {
  width: 70%;
  border: 3px solid transparent;
  border-top-color: var(--color-brand);
  border-right-color: var(--color-brand-light);
  animation: spin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.spinner-ring-outer {
  width: 60%;
  border: 2px solid transparent;
  border-bottom-color: var(--color-border);
  border-left-color: var(--color-border);
  animation: spin-reverse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  to {
    transform: rotate(-360deg);
  }
}
</style>