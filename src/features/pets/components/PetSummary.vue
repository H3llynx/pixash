<script setup lang="ts">
import type { Pet } from '../types';
import PetSelector from './PetSelector.vue';

const props = defineProps<{ pet: Pet }>();
</script>

<template>
    <section aria-label="Pet summary">
        <PetSelector />
    </section>
    <section aria-label="Upcoming events">
        <!-- events list -->
    </section>
</template>