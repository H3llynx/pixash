<script setup lang="ts">
import type { Pet } from '../types';
import { getPetIcon } from '../utils';

const props = defineProps<{ pet: Pet }>()
</script>

<template>
    <img v-if="pet.photo" :src="pet.photo" :alt="pet.name"
        class="shadow-lg w-full h-full object-cover relative rounded-full" />
    <span v-else>{{ getPetIcon(pet) }}</span>
</template>