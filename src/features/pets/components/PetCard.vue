<script setup lang="ts">
import { Camera, Edit2 } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useDialog } from '../../../composables/useDialog.ts';
import { usePictureUpdate } from '../../../composables/usePictureUpdate.ts';
import { useToast } from '../../../composables/useToast.ts';
import { getLabel } from '../../../utils.ts';
import { usePetDetails } from '../composables/usePetDetails.ts';
import { usePets } from '../composables/usePets.ts';
import { getAge, getBreedOptions } from '../utils.ts';
import InsuranceRow from './InsuranceRow.vue';
import MicrochipRow from './MicrochipRow.vue';
import PetIcon from './PetIcon.vue';
import PetPictureUpdate from './PetPictureUpdate.vue';

const { selectPet, deleteSelectedPet, isUpdatingPet } = usePets();
const { isEditingPicture } = usePictureUpdate();
const { open } = useDialog();
const { show } = useToast();
const { t } = useI18n();

const { selectedPet } = usePets();
const { unitFactor, preferredUnit } = usePetDetails();

const updatePetInfo = () => {
    if (!selectedPet.value) return;
    selectPet(selectedPet.value);
    isUpdatingPet.value = true;
};

const handleDelete = async () => {
    if (!selectedPet.value) return;
    open({
        title: t("dialog.deletePet.title", { name: selectedPet.value.name }),
        message: t("dialog.deletePet.message", { name: selectedPet.value.name }),
        isDelete: true,
        onConfirm: async () => {
            try {
                await deleteSelectedPet(selectedPet.value!);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.nameDeleted", { name: selectedPet.value!.name }),
                });
            } catch (error) { console.log(error) }
        }
    });
};
</script>

<template>
    <div v-if="selectedPet" class="card card-border gap-1">
        <div class="flex items-center gap-1">
            <button @click="isEditingPicture = true" :aria-label="t('pet.cta.updatePic', { name: selectedPet.name })"
                class="group update-pic-btn rounded-full md:overflow-hidden w-4 h-4 bg-accent-softer text-4xl flex shrink-0 justify-center items-center relative">
                <PetIcon :pet="selectedPet" />
                <Camera
                    class="absolute -bottom-0.5 left-0 w-1.75 h-1.5 p-[3px] rounded-lg text-white md:opacity-0 md:group-hover:opacity-100 md:default-transition md:bottom-0 md:w-full md:h-full md:p-1 bg-charcoal-rgba" />
            </button>
            <div class="w-full">
                <div class="flex gap-0.5 items-center">
                    <h1>{{ selectedPet.name }}</h1>
                    <Button variant="ghost" size="xs"
                        :aria-label="t('pet.profile.edit.generalInformation', { name: selectedPet.name })"
                        @click="updatePetInfo">
                        <Edit2 :size="15" />
                    </Button>
                    <Button action="delete" :aria-label="t('pet.cta.delete', { name: selectedPet.name })"
                        @click="handleDelete" />
                </div>
                <div class="text-text-secondary text-sm mb-0.5">
                    <span v-if="selectedPet.breed" class="capitalize">{{ t(getLabel(selectedPet.breed,
                        getBreedOptions(selectedPet.species))) }}
                        ·
                    </span>
                    <span>{{ getAge(selectedPet)?.text }} · </span>
                    <span class="capitalize">{{ selectedPet.sex }}</span>
                    <span v-if="selectedPet.weight"> · {{ selectedPet.weight * unitFactor }}{{ preferredUnit }}</span>
                </div>
                <div class="flex gap-0.5">
                    <span class="tag capitalize bg-green-rgba text-green" v-if="selectedPet.sterilized">{{
                        selectedPet.sex ===
                            "male" ?
                            t("pet.profile.labels.sterilized.male") : t("pet.profile.labels.sterilized.female") }}</span>
                    <span class="tag capitalize bg-gold-rgba text-gold-dark" v-if="selectedPet.microchipped">{{
                        t("pet.profile.labels.microchipped") }}</span>
                </div>
            </div>
        </div>
        <MicrochipRow />
        <InsuranceRow />
    </div>
    <PetPictureUpdate v-model:petPicVisible="isEditingPicture" />
</template>