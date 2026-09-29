<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePets } from '../../../pets/composables/usePets.ts';
import { LUMP_STATUS } from '../../config.ts';
import type { LumpExtended } from '../../types';
import { fromMm, getLatestLumpCheckValue } from '../../utils.ts';

const { selectLump } = usePets();
const { t } = useI18n();

const props = defineProps<{ lump: LumpExtended }>();

const status = computed(() => getLatestLumpCheckValue(props.lump.checks, "status"));
const size = computed(() => getLatestLumpCheckValue(props.lump.checks, "size"));
const picture = computed(() => getLatestLumpCheckValue(props.lump.checks, "pictures")?.at(-1));
</script>

<template>
    <button tabindex="0" @click="selectLump(lump)" class="card border border-border w-3xs p-0 overflow-hidden">
        <img v-if="picture" :src="picture">
        <span v-else class="w-full text-center py-2 card-border">📷</span>
        <div class="px-1 pb-1 pt-0.25 text-left">
            <div class="flex justify-between gap-1 items-center">
                <h4>{{ lump.title }}</h4>
                <span class="text-text-secondary text-xs">{{ fromMm(Number(size!.valueMm), size!.displayUnit) }} {{
                    size?.displayUnit }}</span>
            </div>
            <span class="lump-status tag uppercase font-medium mt-0.75"
                :style="{ '--bg-color': LUMP_STATUS.find(s => s.id === status)?.rgba, '--text-color': LUMP_STATUS.find(s => s.id === status)?.rgb }">
                {{t(LUMP_STATUS.find(s => s.id === status)!.label)}}
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