<script setup lang="ts">
import { Camera, Edit2, Trash2 } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useDialog } from '../../../composables/useDialog';
import { usePictureUpdate } from '../../../composables/usePictureUpdate';
import { useToast } from '../../../composables/useToast';
import { getLabel } from '../../../utils';
import { usePetDetails } from '../composables/usePetDetails';
import { usePets } from '../composables/usePets';
import type { PetExtended } from '../types';
import { getAge, getBreedOptions } from '../utils';
import MicrochipRow from './MicrochipRow.vue';
import PetIcon from './PetIcon.vue';
import PetPictureUpdate from './PetPictureUpdate.vue';

const { selectPet, deleteSelectedPet, isUpdatingPet } = usePets();
const { isEditingPicture } = usePictureUpdate();
const { open } = useDialog();
const { show } = useToast();
const { t } = useI18n();

const props = defineProps<{ pet: PetExtended }>();
const { unitFactor, preferredUnit } = usePetDetails(props.pet);

const updatePetInfo = () => {
    selectPet(props.pet);
    isUpdatingPet.value = true;
};

const handleDelete = async () => {
    if (!props.pet) return;
    open({
        title: t("dialog.deletePet.title"),
        message: t("dialog.deletePet.message", { name: props.pet.name }),
        isDelete: true,
        onConfirm: async () => {
            try {
                await deleteSelectedPet(props.pet);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.nameDeleted", { name: props.pet.name }),
                });
            } catch (error) { console.log(error) }
        }
    });
};
</script>

<template>
    <div class="card">
        <div class="flex items-center gap-1">
            <button @click="isEditingPicture = true" :aria-label="t('pet.cta.updatePic', { name: pet.name })"
                class="group update-pic-btn rounded-full md:overflow-hidden w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center relative">
                <PetIcon :pet="pet" />
                <Camera
                    class="absolute -bottom-0.5 left-0 w-1.75 h-1.5 p-[3px] rounded-lg text-white md:opacity-0 md:group-hover:opacity-100 md:default-transition md:bottom-0 md:w-full md:h-full md:p-1 bg-charcoal-rgba" />
            </button>
            <div class="w-full">
                <div class="flex gap-0.5 items-center">
                    <h1>{{ pet.name }}</h1>
                    <Button variant="ghost" size="xs"
                        :aria-label="t('pet.profile.edit.generalInformation', { name: pet.name })"
                        @click="updatePetInfo">
                        <Edit2 :size="15" />
                    </Button>
                    <Button variant="ghost" size="xs" class="ml-auto"
                        :aria-label="t('pet.cta.delete', { name: pet.name })" @click="handleDelete">
                        <Trash2 :size="22" color="var(--color-border)" />
                    </Button>
                </div>
                <div class="text-text-secondary text-sm mb-0.5">
                    <span v-if="pet.breed" class="capitalize">{{ getLabel(pet.breed, getBreedOptions(pet.species)) }} ·
                    </span>
                    <span>{{ getAge(pet)?.text }} · </span>
                    <span class="capitalize">{{ pet.sex }}</span>
                    <span v-if="pet.weight"> · {{ pet.weight * unitFactor }}{{ preferredUnit }}</span>
                </div>
                <div class="flex gap-0.5">
                    <span class="tag capitalize bg-green-rgba text-green-pale" v-if="pet.sterilized">{{ pet.sex ===
                        "male" ?
                        t("pet.profile.labels.sterilized.male") : t("pet.profile.labels.sterilized.female") }}</span>
                    <span class="tag capitalize bg-gold-rgba text-gold-dark" v-if="pet.microchipped">{{
                        t("pet.profile.labels.microchipped") }}</span>
                </div>
            </div>
        </div>
        <MicrochipRow :pet="pet" />
    </div>
    <PetPictureUpdate v-model:petPicVisible="isEditingPicture" />
</template>