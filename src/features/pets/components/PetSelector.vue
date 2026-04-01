<script setup lang="ts">
import { Plus } from '@lucide/vue';
import Button from '../../../components/Button.vue';
import { usePets } from '../composable/usePet';
import { getIcon } from '../utils';

const { pets, selectPet, selectedPet, startAdding, isAdding } = usePets();
</script>

<template>
    <div aria-label="Pet selector" class="pet-selector flex gap-0.5 px-2 md:px-3 overflow-x-scroll">
        <Button variant="chip" size="sm" v-for="pet in pets" :class="selectedPet?.id === pet.id && 'active'"
            @click="selectPet(pet)">
            <span aria-hidden>{{ getIcon(pet) }}</span>
            {{ pet.name }}</Button>
        <Button variant="chip" size="sm" :class="isAdding && 'active'" @click="startAdding">
            <Plus /> Add
        </Button>
    </div>
</template>

<style scoped>
.active {
    background: var(--color-brand);
    color: var(--color-text-chip);
    border-color: var(--color-brand);
    font-weight: 500;
}

.pet-selector::-webkit-scrollbar {
    display: none;
}
</style>