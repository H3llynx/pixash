<script setup lang="ts">
import { usePets } from '../composables/usePets';
import type { Pet } from '../types';
import { getPetIcon } from '../utils';

const { loading } = usePets();

const props = defineProps<{ pet: Pet; class?: string }>()
</script>

<template>
    <img v-if="pet.photo && !loading" :src="pet.photo" :alt="pet.name"
        class="shadow-lg w-full h-full object-cover relative rounded-full" />
    <span v-else :class="class">{{ getPetIcon(pet) }}</span>
</template>