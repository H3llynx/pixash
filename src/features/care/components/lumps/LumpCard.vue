<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useLumpCheck } from '../../composables/useLumpCheck.ts';
import { LUMP_STATUS } from '../../config.ts';
import type { LumpExtended } from '../../types';
import { fromMm, getLatestLumpCheckValue, getNearestBodyRegion } from '../../utils.ts';

const { pets } = usePets();
const { getSizeTrend, openModal, lumpChecks, isLumpRemoved } = useLumpCheck();
const { t } = useI18n();

const props = defineProps<{ lump: LumpExtended }>();

const pet = computed(() => pets.value.find(p => p.id === props.lump.petId));
const checks = computed(() => lumpChecks.value.filter(check => check.lumpId === props.lump.id));
const status = computed(() => isLumpRemoved(props.lump.id) ? "removed" : getLatestLumpCheckValue(checks.value, "status"));
const size = computed(() => getLatestLumpCheckValue(checks.value, "size"));
const picture = computed(() => getLatestLumpCheckValue(checks.value, "pictures")?.at(-1));
const location = computed(() => {
    const region = getNearestBodyRegion(pet.value?.species as "dog" | "cat", props.lump.location.x, props.lump.location.y);
    return t(`health.lumpForm.bodyRegions.${region.id}.${props.lump.location.side}`);
});
const lastChecked = computed(() => getLatestLumpCheckValue(checks.value, "date"));
const trend = computed(() => getSizeTrend(props.lump.id));
</script>

<template>
    <button @click="openModal(lump, 'view')" class="card w-3xs border border-border p-0 overflow-hidden">
        <div class="w-full bg-picture-placeholder h-7 flex justify-center items-center overflow-hidden">
            <img v-if="picture" :src="picture" class="w-full object-cover">
            <span v-else>📷</span>
        </div>
        <div class="px-1 pb-1 pt-0.25 text-left">
            <div class="flex justify-between gap-1">
                <h4>{{ lump.title }}</h4>
                <span v-if="size" class="text-text-secondary text-xs shrink-0">{{ fromMm(Number(size.valueMm),
                    size.displayUnit)
                }} {{ size.displayUnit }}</span>
            </div>
            <span class="text-text-secondary text-xs font-medium inline-flex">
                {{ location }} · {{ t('common.text.lastChecked', { date: tsToDate(lastChecked, "dateShort") })
                }}
            </span>
            <div class="flex justify-between items-center gap-1 mt-0.75">
                <span
                    class="lump-status shrink-0 rounded-full text-[0.7rem] px-0.5 py-0.25 tracking-wide uppercase font-medium"
                    :style="{ '--bg-color': LUMP_STATUS.find(s => s.id === status)?.rgba, '--text-color': LUMP_STATUS.find(s => s.id === status)?.rgb }">
                    {{t(LUMP_STATUS.find(s => s.id === status)!.label)}}
                </span>
                <span v-if="trend" class="flex gap-0.25 items-center"
                    :style="{ color: trend === 'up' ? 'var(--color-yellow)' : trend === 'down' ? 'var(--color-text-softer)' : 'var(--color-text-secondary)' }">
                    <ArrowUp :size="14" v-if="trend === 'up'" />
                    <ArrowDown :size="14" v-if="trend === 'down'" />
                    <span class="text-xs">{{ t(`health.lumps.trend.${trend}`) }}</span>
                </span>
            </div>
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