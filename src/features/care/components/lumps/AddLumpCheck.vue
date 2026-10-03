<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import FreeModal from '../../../../components/FreeModal.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useLumpForm } from '../forms/composables/useLumpForm.ts';
import LumpCheckArea from '../forms/LumpCheckArea.vue';
import { computed, ref, watch } from 'vue';
import Button from '../../../../components/Button.vue';
import { useLumpCheck } from '../lumps/composables/useLumpCheck.ts';
import PetIcon from '../../../pets/components/PetIcon.vue';
import { fromMm, getLatestLumpCheckValue } from '../../utils.ts';
import { tsToDate } from '../../../../utils.ts';
import { useToast } from '../../../../composables/useToast.ts';
import LoadingPet from '../../../../components/loading/LoadingPet.vue';

const { pets, addNewLumpCheck, careError } = usePets();
const { checkData } = useLumpForm();
const { pictures, loadedPictures, isCheckEmpty, logCheck, closeModal, checkedLump, isModalOpen } = useLumpCheck();
const { show } = useToast();
const { t } = useI18n();

const loading = ref<boolean>(false);

const pet = computed(() => pets.value.find(pet => pet.id === checkedLump.value?.petId));
const lastPicture = computed(() => getLatestLumpCheckValue(checkedLump.value?.checks || [], "pictures")?.at(-1));
const lastSize = computed(() => getLatestLumpCheckValue(checkedLump.value?.checks || [], "size"));
const lastChecked = computed(() => getLatestLumpCheckValue(checkedLump.value?.checks || [], "date"));
const lastStatus = computed(() => getLatestLumpCheckValue(checkedLump.value?.checks || [], "status"));

const handleSubmit = async () => {
    if (!checkedLump.value || isCheckEmpty(checkData, lastStatus.value)) return;
    loading.value = true;
    try {
        await addNewLumpCheck(logCheck(checkData), checkedLump.value);
        show({
            type: "success",
            title: t("toast.success.title.generic"),
            message: t("toast.success.message.lumpUpdated", { title: checkedLump.value.title }),
        });
        closeModal();
    }
    catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
    }
    finally {
        loading.value = false;
    }
};

watch(() => checkedLump.value, (lump) => {
    if (lump && lastStatus.value) {
        checkData.status = lastStatus.value;
    }
});
</script>

<template>
    <FreeModal v-model="isModalOpen" size="md">
        <LoadingPet v-if="loading" />
        <div v-else class="scroll-container">
            <div class="flex gap-1 my-2 default-padding ">
                <div class="rounded-full w-3 h-3 text-3xl flex shrink-0 justify-center items-center">
                    <PetIcon :pet="pet!" />
                </div>
                <div class="w-full flex gap-1 justify-between">
                    <h2 class="text-accent">{{ pet?.name }} · {{ checkedLump?.title }}</h2>
                    <div class="flex flex-col items-end gap-0.25">
                        <div
                            class="w-6 shrink-0 bg-picture-placeholder rounded-xl border border-accent-rgba h-4 flex justify-center items-center overflow-hidden">
                            <img v-if="lastPicture" :src="lastPicture" class="w-full object-cover">
                            <span v-else class="text-sm">📷</span>
                        </div>
                        <span v-if="lastSize" class="text-text-softer text-xs shrink-0 mr-0.25">{{
                            fromMm(Number(lastSize.valueMm),
                                lastSize.displayUnit)
                        }} {{ lastSize.displayUnit }}</span>
                        <span class="text-text-secondary text-right font-light text-xs inline-flex">
                            {{ t('common.text.lastChecked', { date: tsToDate(lastChecked, "dateShort") })
                            }}
                        </span>
                    </div>
                </div>
            </div>
            <form class="mini-form pb-2" @submit.prevent="">
                <LumpCheckArea v-model="checkData" v-model:pictures="pictures" :loadedPictures="loadedPictures" />
                <div class="flex flex-col gap-1 pt-1.5 default-padding">
                    <Button :disabled="isCheckEmpty(checkData, lastStatus) || loading" @click="handleSubmit">{{
                        t("common.button.confirm") }}</Button>
                    <Button type="button" variant="ghost" @click="closeModal">{{ t("common.button.cancel") }}</Button>
                </div>
            </form>
        </div>
    </FreeModal>
</template>