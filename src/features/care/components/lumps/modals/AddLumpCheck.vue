<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import FreeModal from '../../../../../components/FreeModal.vue';
import { usePets } from '../../../../pets/composables/usePets.ts';
import { useLumpForm } from '../../forms/composables/useLumpForm.ts';
import LumpCheckArea from '../../forms/LumpCheckArea.vue';
import { computed, ref, watch } from 'vue';
import Button from '../../../../../components/Button.vue';
import { useLumpCheck } from '../../../composables/useLumpCheck.ts';
import PetIcon from '../../../../pets/components/PetIcon.vue';
import { fromMm, getLatestLumpCheckValue } from '../../../utils.ts';
import { tsToDate } from '../../../../../utils.ts';
import LoadingPet from '../../../../../components/loading/LoadingPet.vue';
import { useToast } from '../../../../../composables/useToast.ts';

const { pets, addNewLog, careError } = usePets();
const { checkData } = useLumpForm();
const { selectedLumpChecks, pictures, loadedPictures, isCheckEmpty, logCheck, closeModal, checkedLump, isEditModalOpen, isViewModalOpen } = useLumpCheck();
const { t } = useI18n();
const { show } = useToast();

const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const pet = computed(() => pets.value.find(pet => pet.id === checkedLump.value?.petId));

const lastPicture = computed(() => getLatestLumpCheckValue(selectedLumpChecks.value, "pictures")?.at(-1));
const lastSize = computed(() => getLatestLumpCheckValue(selectedLumpChecks.value, "size"));
const lastChecked = computed(() => getLatestLumpCheckValue(selectedLumpChecks.value, "date"));
const lastStatus = computed(() => getLatestLumpCheckValue(selectedLumpChecks.value, "status"));

const handleCancel = () => {
    closeModal('edit', checkData);
    error.value = null;
};

const handleSubmit = async () => {
    if (!checkedLump.value || !pet.value || isCheckEmpty(checkData, lastStatus.value)) return;
    if (error) error.value = null;
    loading.value = true;
    try {
        await addNewLog(logCheck(checkData, checkedLump.value.id), pet.value.id);
        if (!isViewModalOpen.value) show({
            type: "success",
            title: t("toast.success.title.generic"),
            message: t("toast.success.message.lumpUpdated", { title: checkedLump.value.title }),
        });
        closeModal('edit', checkData);
    }
    catch (e) {
        error.value = careError.value;
    }
    finally {
        loading.value = false;
    }
};

watch(() => checkedLump.value, (lump) => {
    if (lump && lastStatus.value) {
        checkData.status = lastStatus.value;
    }
}, { immediate: true });
</script>

<template>
    <FreeModal v-model="isEditModalOpen" size="md">
        <LoadingPet v-if="loading" />
        <div v-else class="scroll-container">
            <p v-if="error" class="text-sm w-full text-error px-1 pt-1">
                {{ error }}
            </p>
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
                    <Button type="button" variant="ghost" @click="handleCancel">{{ t("common.button.cancel")
                        }}</Button>
                </div>
            </form>
        </div>
    </FreeModal>
</template>