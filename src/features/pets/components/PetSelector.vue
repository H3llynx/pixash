<script setup lang="ts">
import { Plus } from '@lucide/vue';
import Button from '../../../components/Button.vue';
import { usePets } from '../composable/usePet';

const { pets, selectedPet } = usePets();

</script>

<template>
    <div v-if="selectedPet" aria-label="Pet selector" class="flex gap-0.5">
        <Button variant="chip" size="sm" v-for="pet in pets" :class="selectedPet.id === pet.id && 'active'">
            {{ pet.name }}</Button>
        <Button variant="chip" size="sm">
            <Plus /> Add
        </Button>
    </div>
</template>

<style scoped>
.active {
    background: var(--color-brand);
    color: var(--color-text-chip);
    border-color: var(--color-brand);
}
</style>