<script setup lang="ts">
import pixie from '../../assets/pixie-plants.png';
import sasha from '../../assets/sasha-pirate.png';
import { usePets } from '../../features/pets/composables/usePets';

const { selectedPet } = usePets();
</script>

<template>
  <div class="flex flex-col items-center justify-center relative max-w-lg m-auto aspect-square">
    <div class="spinner-ring" :style="{
      borderTopColor: selectedPet?.species === 'dog' ? 'var(--color-orange)' : 'var(--color-green)',
      borderRightColor: selectedPet?.species === 'dog' ? 'var(--color-orange-rgba)' : 'var(--color-green-rgba)'
    }"></div>
    <div class="spinner-ring-outer"></div>
    <img :src="selectedPet?.species === 'dog' ? sasha : pixie" class="max-w-[80%] rounded-full" />
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
  width: 80%;
  border: 3px solid transparent;
  animation: spin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.spinner-ring-outer {
  width: 75%;
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