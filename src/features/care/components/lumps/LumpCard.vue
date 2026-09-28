<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { usePets } from '../../../pets/composables/usePets.ts';
import { LUMP_STATUS } from '../../config.ts';
import type { LumpExtended } from '../../types';

const { selectLump } = usePets();
const { t } = useI18n();

const props = defineProps<{ lump: LumpExtended }>();
</script>

<template>
    <button tabindex="0" @click="selectLump(lump)" class="card border border-border w-3xs p-0">
        <img v-if="lump.pictures?.length" :src="lump.pictures[-1]">
        <span v-else class="w-full text-center py-2 card-border">📷</span>
        <div class="px-1 pb-1 pt-0.5 text-left">
            <h4>{{ lump.title }}</h4>
            <span class="lump-status tag uppercase font-medium mt-0.5"
                :style="{ '--bg-color': LUMP_STATUS.find(s => s.id === lump.status)?.rgba, '--text-color': LUMP_STATUS.find(s => s.id === lump.status)?.rgb }">
                {{t(LUMP_STATUS.find(s => s.id === lump.status)!.label)}}
            </span>
        </div>
    </button>
</template>

<style scoped>
@media (width >=48rem) {

    h4,
    p {
        font-size: clamp(0.85rem, 0.5vw, 1rem);
    }
}
</style>