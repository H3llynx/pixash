<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { tsToDate } from '../../../utils';
import PetIndicator from '../../pets/components/PetIndicator.vue';
import type { PetExtended } from '../../pets/types';
import type { VaccineExtended } from '../types';

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMd = breakpoints.greaterOrEqual("md");

defineProps<{
    title: string
    data: VaccineExtended
    pet: PetExtended
}>();

</script>

<template>
    <div class="p-1 rounded-xl border border-border bg-bg-2 w-1/2 max-w-3xs flex gap-0.5 justify-between">
        <div>
            <h3>{{ title }}</h3>
            <p class="text-lg font-medium">{{ tsToDate(data.dueOn, "date") }}</p>
            <p class="text-xs text-brand-light">{{ tsToDate(data.dueOn, "daysUntil") }}</p>
        </div>
        <PetIndicator v-if="isMd" :pet="pet" />
    </div>
</template>

<style scoped>
h3 {
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-size: smaller;
}
</style>