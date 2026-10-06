<script setup lang="ts">
import { Pen, Plus, X } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../../components/Button.vue';
import FreeModal from '../../../../../components/FreeModal.vue';
import { usePets } from '../../../../pets/composables/usePets.ts';
import { useLumpCheck } from '../../../composables/useLumpCheck.ts';
import { LUMP_STATUS } from '../../../config.ts';
import { fromMm, getLatestLumpCheckValue, getNearestBodyRegion, isLumpRemoved } from '../../../utils.ts';

const { pets, selectLump } = usePets();
const { isViewModalOpen, openModal, checkedLump, closeModal, getSizeProgression } = useLumpCheck();
const { t } = useI18n();

const editLump = () => {
    selectLump(checkedLump.value);
    closeModal('view');
}

const pet = computed(() => pets.value.find(p => p.id === checkedLump.value?.petId));
const size = computed(() => getLatestLumpCheckValue(checkedLump.value?.checks || [], "size"));
const status = computed(() => {
    if (!checkedLump.value) return null;
    return isLumpRemoved(checkedLump.value) ? "removed" : getLatestLumpCheckValue(checkedLump.value.checks, "status");
});
const location = computed(() => {
    if (!checkedLump.value || !pet.value) return "";
    const region = getNearestBodyRegion(pet.value.species as "dog" | "cat", checkedLump.value.location.x, checkedLump.value.location.y);
    return t(`health.lumpForm.bodyRegions.${region.id}.${checkedLump.value.location.side}`);
});

const progression = computed(() => {
    if (!checkedLump.value) return null;
    const value = getSizeProgression(checkedLump.value);
    if (value === null || value === undefined) return null;
    return {
        value,
        sign: value >= 0 ? "+" : "",
    };
});
</script>

<template>
    <FreeModal v-model="isViewModalOpen" size="md" color="secondary">
        <div v-if="checkedLump" class="scroll-container">
            <div class="px-1.5 py-1 bg-picture-placeholder">
                <div class="flex justify-end items-center gap-0.5">
                    <Button variant="tertiary" size="rounded"
                        class="border-2 border-t-text-softer border-l-text-softer border-b-grey-rgba border-r-grey-rgba hover:border-t-interactive hover:border-l-interactive"
                        @click="editLump" :aria-label="t('common.button.close')">
                        <Pen :size="16" />
                    </Button>
                    <Button variant="ghost" size="min" @click="closeModal('view')"
                        :aria-label="t('common.button.close')">
                        <X :size="18" />
                    </Button>
                </div>
                <h3 class="mt-2 mb-0.25">{{ checkedLump?.title }}</h3>
                <div class="flex items-center gap-0.5">
                    <span class="inline-flex bg-bg  shadow-lg text-xs rounded-full py-[5px] px-0.5">📍
                        {{ location }}</span>
                    <span class="rounded-full text-[0.7rem] px-0.5 py-0.25 tracking-wide uppercase font-medium text-bg"
                        :style="{ backgroundColor: LUMP_STATUS.find(s => s.id === status)?.rgb }">
                        {{t(LUMP_STATUS.find(s => s.id === status)!.label)}}
                    </span>
                </div>
            </div>
            <div class="flex items-end gap-1 md:gap-2 px-1.5 py-1 border-border">
                <div>
                    <span v-if="size" class="block text-xl font-bold">{{ fromMm(Number(size.valueMm),
                        size.displayUnit) }}</span>
                    <span class="block text-xs tracking-wide uppercase text-text-secondary">{{
                        t("health.lumps.currentSize") }}
                    </span>
                </div>
                <div>
                    <span v-if="size && progression"
                        :class="{ 'block text-xl font-bold': true, 'text-yellow': progression.value > 0 }">{{
                            progression.sign }} {{ progression.value }}
                        mm</span>
                    <span class="block text-xs tracking-wide uppercase text-text-secondary">{{
                        t("health.lumps.sinceFirstNoted")
                    }}
                    </span>
                </div>
                <div>
                    <span class="block text-base font-bold">{{ checkedLump?.checks.length }}</span>
                    <span class="block text-xs tracking-wide uppercase text-text-secondary">{{
                        t("health.lumps.checksLogged") }}
                    </span>
                </div>
            </div>
            <div class="flex items-end gap-1 md:gap-2 p-1 border-t border-b border-border">
                <Button variant="ghost" size="min" class="text-green group" @click="openModal(checkedLump, 'edit')">
                    <Plus class="bg-green-rgba group-hover:bg-accent-rgba rounded-full p-0.25 mr-0.25"
                        stroke-width="3" />
                    {{
                        t("health.lumps.addCheck") }}
                </Button>
            </div>
        </div>
    </FreeModal>
</template>

<style scoped>
button svg {
    transition: background 0.4s;
}
</style>