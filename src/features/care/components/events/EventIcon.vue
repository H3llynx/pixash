<script setup lang="ts">
import { BugOff, Stethoscope, Syringe, Weight } from '@lucide/vue';
import type { PetEvent } from '../../types';

defineProps<{ event: PetEvent }>();
</script>

<template>
    <Syringe v-if="event.eventType === 'vaccine'" class="event-icon" :size="20" />
    <Stethoscope v-else-if="event.eventType === 'visit'" class="event-icon" :size="20" />
    <template v-else-if="event.eventType === 'log'">
        <BugOff v-if="event.type === 'antiparasite'" class="event-icon" :size="20" />
        <Weight v-else-if="event.type === 'weight'" class="event-icon" :size="20" />
    </template>
</template>

<style scoped>
.event-icon {
    flex-shrink: 0;
    color: var(--color-accent-softer);
}
</style>