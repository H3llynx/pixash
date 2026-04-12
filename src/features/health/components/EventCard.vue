<script setup lang="ts">
import PetIndicator from '../../pets/components/PetIndicator.vue';
import type { PetExtended } from '../../pets/types';

defineProps<{
    title: string
    date: string
    pet: PetExtended
}>();
</script>
<template>
    <div class="p-1 rounded-xl border border-border bg-bg-2 flex gap-0.5 justify-between mb-1">
        <div>
            <h3>{{ title }}</h3>
            <p class="text-text-secondary">{{ date }}</p>
        </div>
        <PetIndicator :pet="pet" />
    </div>
</template>