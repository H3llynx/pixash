<script setup lang="ts">
import PetIndicator from '../../pets/components/PetIndicator.vue';
import type { Upcoming } from '../types';

defineProps<{ event: Upcoming }>();
</script>
<template>
    <div class="p-1 rounded-xl border border-border bg-bg-2 flex gap-0.5 justify-between mb-1">
        <div>
            <h4>{{ event.title }}</h4>
            <p class="text-text-secondary">{{ event.date }}</p>
        </div>
        <PetIndicator :pet="event.pet" />
    </div>
</template>