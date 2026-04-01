<script setup lang="ts">
import { usePets } from '../composable/usePet';

const { selectedPet } = usePets();
</script>

<template>
    <section v-if="selectedPet" class="pet-section">
        <h2>{{ selectedPet.name }}'s profile</h2>
        <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2">
        </div>
    </section>
</template>