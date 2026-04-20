<script setup lang="ts">
import { computed } from 'vue';
import { useMedia } from '../../../composables/useMedia';
import { tsToDate } from '../../../utils';
import PetIndicator from '../../pets/components/PetIndicator.vue';
import type { PetExtended } from '../../pets/types';
import type { PetEvent } from '../types';

const { isMd } = useMedia();

const props = defineProps<{
    title: string
    data: PetEvent
    pet: PetExtended
}>();

const date = computed(() => props.data.dueOn ? tsToDate(props.data.dueOn, "date") : tsToDate(props.data.date, "date"));
const daysUntil = computed(() => props.data.dueOn ? tsToDate(props.data.dueOn, "daysUntil") : tsToDate(props.data.date, "daysUntil"))

</script>

<template>
    <div class="p-1 rounded-xl border border-border bg-bg-2 w-1/2 max-w-3xs flex gap-0.5 justify-between">
        <div>
            <h3>{{ title }}</h3>
            <p class="text-lg font-medium">{{ date }}</p>
            <p class="text-xs text-brand-light">{{ daysUntil }}</p>
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