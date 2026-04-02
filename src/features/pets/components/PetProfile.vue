<script setup lang="ts">
import { usePets } from '../composable/usePet';
import { getAge, getIcon } from '../utils';

const { selectedPet } = usePets();
</script>

<template>
    <section v-if="selectedPet" class="pet-section">
        <h2>{{ selectedPet.name }}'s profile</h2>
        <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 capitalize">
            <div class="flex justify-between items-center">
                <div class="rounded-full w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    {{ getIcon(selectedPet) }}
                </div>
                <div class="mr-auto p-1 text-text-secondary text-sm">
                    <h1>{{ selectedPet.name }}</h1>
                    <span v-if="selectedPet.breed">{{ selectedPet.breed }} · </span>
                    <span>{{ getAge(selectedPet) }} years old · </span>
                    <span>{{ selectedPet.sex }}</span>
                </div>
            </div>
            <div class="text-sm">
                <div class="row">
                    <span>Weight</span>
                </div>
                <div class="row">
                    <span>Next vaccine</span>
                </div>
                <div class="row">
                    <span>Microchip</span>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;

    span:first-child {
        color: var(--color-text-secondary);
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-separator)
    }
}
</style>