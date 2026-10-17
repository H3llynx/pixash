<script setup lang="ts">
import { Plus, X } from '@lucide/vue';
import { computed } from 'vue';
import VueEasyLightbox, { useEasyLightbox } from 'vue-easy-lightbox';
import { useI18n } from 'vue-i18n';
import Button from '../../../../../components/Button.vue';
import FreeModal from '../../../../../components/FreeModal.vue';
import { tsToDate } from '../../../../../utils.ts';
import { usePets } from '../../../../pets/composables/usePets.ts';
import { useLumpCheck } from '../../../composables/useLumpCheck.ts';
import { LUMP_STATUS } from '../../../config.ts';
import { fromMm, getLatestLumpCheckValue, getNearestBodyRegion } from '../../../utils.ts';

const { pets, selectLump, savingLogIds } = usePets();
const { selectedLumpChecks, isViewModalOpen, openModal, checkedLump, closeModal, isLumpRemoved, getSizeProgression } = useLumpCheck();
const { t } = useI18n();
const { show, onHide, visibleRef, indexRef, imgsRef, changeIndex } = useEasyLightbox({ imgs: [] });
const hasMultipleImages = computed(() => Array.isArray(imgsRef.value) && imgsRef.value.length > 1);

const pet = computed(() => pets.value.find(p => p.id === checkedLump.value?.petId));

const size = computed(() => getLatestLumpCheckValue(selectedLumpChecks.value, "size"));
const status = computed(() => {
    if (!checkedLump.value) return null;
    return isLumpRemoved(checkedLump.value.id) ? "removed" : getLatestLumpCheckValue(selectedLumpChecks.value, "status");
});
const location = computed(() => {
    if (!checkedLump.value || !pet.value) return "";
    const region = getNearestBodyRegion(pet.value.species as "dog" | "cat", checkedLump.value.location.x, checkedLump.value.location.y);
    return t(`health.lumpForm.bodyRegions.${region.id}.${checkedLump.value.location.side}`);
});

const progression = computed(() => {
    if (!checkedLump.value) return null;
    const value = getSizeProgression(checkedLump.value.id);
    if (value === null || value === undefined) return null;
    return {
        value,
        sign: value >= 0 ? "+" : "",
    };
});

const editLump = () => {
    if (!checkedLump.value) return;
    selectLump(checkedLump.value.id);
    closeModal('view');
};

const openLightbox = (pictures: string[], index = 0) => {
    imgsRef.value = pictures;
    show(index);
};
</script>

<template>
    <FreeModal v-model="isViewModalOpen" size="md" color="secondary">
        <div v-if="checkedLump" class="scroll-container">
            <div class="px-1.5 py-1 bg-picture-placeholder">
                <div class="flex justify-end items-center gap-0.5">
                    <Button action="edit" @click="editLump" :aria-label="t('common.button.edit')" />
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
                <div v-if="size">
                    <span class="block text-xl font-bold">{{ fromMm(Number(size.valueMm),
                        size.displayUnit) }}</span>
                    <span class="block text-xs tracking-wide uppercase text-text-secondary">{{
                        t("health.lumps.currentSize") }}
                    </span>
                </div>
                <div v-if="size && progression">
                    <span :class="{ 'block text-xl font-bold': true, 'text-yellow': progression.value > 0 }">{{
                        progression.sign }} {{ progression.value }}
                        mm</span>
                    <span class="block text-xs tracking-wide uppercase text-text-secondary">{{
                        t("health.lumps.sinceFirstMeasured")
                    }}
                    </span>
                </div>
                <div>
                    <span class="block text-base font-bold">{{ selectedLumpChecks.length }}</span>
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
            <h3 class="px-1.5 pt-1 pb-0.5 text-sm uppercase tracking-wide text-text-secondary">
                {{ t("common.text.timeline") }}</h3>
            <div :class="{ 'flex items-center gap-0.75 px-1.5 py-1 not-last:border-b border-border text-sm': true, 'opacity-40 animate-pulse': savingLogIds.has(check.id) }"
                v-for="check in selectedLumpChecks" :key="check.id">
                <div
                    class="w-3.5 h-3 rounded-xl bg-picture-placeholder border-b border-border-light flex justify-center items-center overflow-hidden">
                    <img v-if="check.pictures?.length" :src="check.pictures[0]" @click="openLightbox(check.pictures)"
                        class="w-full h-full object-cover cursor-pointer">
                    <span v-else>📷</span>
                </div>
                <div class="w-full">
                    <div class="flex justify-between gap-0.5">
                        <h4>{{ tsToDate(check.date, "date") }}</h4>
                        <span v-if="check.size" class="text-text-secondary text-xs">{{
                            fromMm(Number(check.size.valueMm),
                                check.size.displayUnit) }} {{ check.size.displayUnit }}</span>
                    </div>
                    <p v-if="check.notes" class="text-xs text-text-secondary">{{ check.notes }}</p>
                    <p class="text-[0.6rem] tracking-wide font-medium uppercase pt-0.5"
                        :style="{ color: LUMP_STATUS.find(s => s.id === check.status)?.rgb }">
                        {{
                            check.status }}</p>
                </div>
            </div>
            <VueEasyLightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" :loop="true" @hide="onHide" />
            <div v-if="visibleRef && hasMultipleImages"
                class="fixed bottom-3 left-0 z-9998 flex gap-0.5 p-0.5 overflow-x-auto">
                <img v-for="(img, i) in (imgsRef as string[])" :key="i" :src="img"
                    :class="{ 'w-3 h-3 object-cover cursor-pointer rounded-lg': true, 'ring-2 ring-accent': i === indexRef }"
                    @click="changeIndex(i)" />
            </div>
        </div>
    </FreeModal>
</template>

<style scoped>
button svg {
    transition: background 0.4s;
}
</style>