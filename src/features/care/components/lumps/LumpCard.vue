<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import { LUMP_STATUS } from '../../config.ts';
import type { LumpExtended } from '../../types';
import { fromMm, getLatestLumpCheckValue } from '../../utils.ts';
import { useBodyMap } from './composables/useBodyMap.ts';

const { pets, selectLump } = usePets();
const { t } = useI18n();

const props = defineProps<{ lump: LumpExtended }>();
const { getNearestBodyRegion } = useBodyMap(props.lump.location, ref(false));

const pet = computed(() => pets.value.find(p => p.id === props.lump.petId));
const status = computed(() => getLatestLumpCheckValue(props.lump.checks, "status"));
const size = computed(() => getLatestLumpCheckValue(props.lump.checks, "size"));
const picture = computed(() => getLatestLumpCheckValue(props.lump.checks, "pictures")?.at(-1));
const location = computed(() => {
    const region = getNearestBodyRegion(pet.value?.species as "dog" | "cat", props.lump.location.x, props.lump.location.y);
    return t(`health.lumpForm.bodyRegions.${region.id}.${props.lump.location.side}`);
});
const lastChecked = computed(() => getLatestLumpCheckValue(props.lump.checks, "date"));
</script>

<template>
    <button tabindex="0" @click="selectLump(lump)" class="card w-3xs border border-border p-0 overflow-hidden">
        <div class="w-full bg-picture-placeholder h-7 flex justify-center items-center overflow-hidden">
            <img v-if="picture" :src="picture" class="w-full object-cover">
            <span v-else>📷</span>
        </div>
        <div class="px-1 pb-1 pt-0.25 text-left">
            <div class="flex justify-between gap-1">
                <h4>{{ lump.title }}</h4>
                <span class="text-text-secondary text-xs shrink-0">{{ fromMm(Number(size!.valueMm),
                    size!.displayUnit)
                }} {{
                        size?.displayUnit }}</span>
            </div>
            <span class="text-text-secondary text-xs font-medium">
                {{ location }} · {{ t('common.text.lastChecked', { date: tsToDate(lastChecked, "dateShort") })
                }}
            </span>
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