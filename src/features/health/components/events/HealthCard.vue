<script setup lang="ts">
import { computed } from 'vue';
import { tsToDate } from '../../../../utils';
import type { PetExtended } from '../../../pets/types';
import type { PetEvent } from '../../types';

const props = defineProps<{
    title: string
    data: PetEvent
    pet: PetExtended
}>();

const date = computed(() => props.data.dueOn ? tsToDate(props.data.dueOn, "date") : tsToDate(props.data.date, "date"));
const daysUntil = computed(() => props.data.dueOn ? tsToDate(props.data.dueOn, "daysUntil") : tsToDate(props.data.date, "daysUntil"))

</script>

<template>
    <div
        class="p-1 rounded-xl border border-border bg-bg-2 flex gap-0.5 justify-between min-w-1/2 shrink-0 md:min-w-1/3 md:shrink">
        <div class="text-left flex flex-col h-full">
            <h3>{{ title }}</h3>
            <p class="font-medium">{{ date }}</p>
            <p class="text-xs text-brand-light mb-0.5">{{ daysUntil }}</p>
        </div>
    </div>
</template>

<style scoped>
h3 {
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-size: clamp(0.75rem, 0.5vw, 1rem);
}
</style>