<script setup lang="ts">
import { Edit2, Trash2 } from '@lucide/vue';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useDialog } from '../../../composables/useDialog';
import { useToast } from '../../../composables/useToast';
import { getLabel } from '../../../utils';
import { usePets } from '../composables/usePets';
import type { PetExtended } from '../types';
import { getAge, getBreedOptions, getIcon } from '../utils';
import PetProfileRow from './PetProfileRow.vue';

const { selectPet, deleteSelectedPet, isUpdatingPet } = usePets();
const { open } = useDialog();
const { show } = useToast();
const { t } = useI18n();

const props = defineProps<{ pet: PetExtended }>();
const isUpdating = reactive({
    generalInfo: false,
    weight: false,
    microchip: false,
    nextVaccine: false,
});

const updateGeneralInfo = () => {
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
    <div class="profile-card md:max-w-sm">
        <div class="flex items-center gap-0.5">
            <div class="rounded-full w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                {{ getIcon(pet) }}
            </div>
            <div class="p-1 text-text-secondary text-sm">
                <div class="flex gap-0.5">
                    <h1>{{ pet.name }}</h1>
                    <Button variant="ghost" size="xs"
                        :aria-label="t('pet.profile.edit.generalInformation', { name: pet.name })"
                        @click="updateGeneralInfo">
                        <Edit2 :size="14" />
                    </Button>
                </div>
                <span v-if="pet.breed" class="capitalize">{{ getLabel(pet.breed, getBreedOptions(pet.species)) }} ·
                </span>
                <span>{{ getAge(pet)?.text }} · </span>
                <span class="capitalize">{{ pet.sex }}</span>
                <span class="capitalize" v-if="pet.sterilized"> · {{ pet.sex === "male" ?
                    t("pet.profile.labels.sterilized.male") : t("pet.profile.labels.sterilized.female") }}</span>
            </div>
            <Button class="ml-auto mb-auto" variant="ghost" size="xs"
                :aria-label="t('pet.cta.delete', { name: pet.name })" @click="handleDelete">
                <Trash2 :size="22" color="var(--color-border)" />
            </Button>
        </div>
        <PetProfileRow :pet="pet" v-model="isUpdating.weight" data="weight" />
        <PetProfileRow :pet="pet" v-model="isUpdating.nextVaccine" data="nextVaccine" />
        <PetProfileRow :pet="pet" v-model="isUpdating.microchip" data="microchip" />
    </div>
</template>