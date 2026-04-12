<script setup lang="ts">
import type { Pet } from '../types';
import { getIcon } from '../utils';

defineProps<{ pet: Pet }>();
</script>

<template>
    <div class="flex flex-col justify-center text-center gap-0.5">
        <div class="rounded-full w-3 h-3 bg-brand-rgba text-3xl flex shrink-0 justify-center items-center">
            {{ getIcon(pet) }}
        </div>
        <p class="text-sm text-brand-light">{{ pet.name }}</p>
    </div>
</template>