<script setup lang="ts">
import { computed } from 'vue';
import { tsToDate } from '../../../../utils.ts';
import type { PetExtended } from '../../../pets/types.ts';
import type { PetEvent } from '../../types.ts';
import DateTag from './DateTag.vue';

const props = defineProps<{
    title: string
    data: PetEvent
    pet: PetExtended
}>();

const timestamp = computed(() => props.data.dueOn ?? props.data.date ?? props.data.ts)
const date = computed(() => props.data.dueOn ? tsToDate(props.data.dueOn, "date") : tsToDate(props.data.date, "date"));
const timeUntil = computed(() => props.data.dueOn ? tsToDate(props.data.dueOn, "timeUntil") : tsToDate(props.data.date, "timeUntil"))

</script>

<template>
    <div
        class="p-1 rounded-xl border border-border bg-bg-2 flex gap-0.5 justify-between min-w-1/2 shrink-0 md:min-w-1/3 lg:min-w-9">
        <div class="text-left flex flex-col h-full">
            <h3>{{ title }}</h3>
            <p class="font-medium">{{ date }}</p>
            <p class="text-xs text-brand-light mb-0.5">{{ timeUntil }}</p>
            <DateTag :date="timestamp" class="mt-auto" withMissed />
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