<script setup lang="ts">
import { Edit2, Trash2 } from '@lucide/vue';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Loading from '../../../components/loading/Loading.vue';
import { useDialog } from '../../../composables/useDialog';
import { useToast } from '../../../composables/useToast';
import { tsToDate } from '../../../utils';
import { usePets } from '../composables/usePet';
import type { PetExtended } from '../types';
import { getAge, getIcon, getWeight } from '../utils';
import UpdatePetDetail from './UpdatePetDetail.vue';

const { selectPet, selectedPet, deleteSelectedPet, healthLoading, isUpdatingPet } = usePets();
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
    isUpdatingPet.value = true
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
                    message: t("toast.success.message.petDeleted", { name: props.pet.name }),
                });
            } catch (error) { console.log(error) }
        }
    });
};
</script>

<template>
    <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 md:w-sm md:shrink-0">
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
                <span v-if="pet.breed" class="capitalize">{{ pet.breed }} · </span>
                <span>{{ getAge(pet)?.text }} · </span>
                <span class="capitalize">{{ pet.sex }}</span>
                <span class="capitalize" v-if="pet.sterilized"> · {{ pet.sex === "male" ?
                    t("pet.profile.label.sterilized.male") : t("pet.profile.label.sterilized.female") }}</span>
            </div>
            <Button class="ml-auto mb-auto" variant="ghost" size="xs"
                :aria-label="t('pet.cta.delete', { name: pet.name })" @click="handleDelete">
                <Trash2 :size="22" color="var(--color-border)" />
            </Button>
        </div>
        <div class="text-sm">
            <div class="profile-row">
                <span>{{ t("pet.profile.label.weight") }}</span>
                <span v-if="pet.weight && !isUpdating.weight">{{ getWeight(pet) }}</span>
                <UpdatePetDetail data="weight" :pet="pet" :isUpdating="isUpdating" />
            </div>
            <div class="profile-row">
                <span>{{ t("pet.profile.label.nextVaccine") }}</span>
                <Loading v-if="healthLoading && pet === selectedPet" />
                <span v-else-if="pet.nextVaccine" class="text-brand font-medium">
                    {{ tsToDate(pet.nextVaccine.dueOn!, "date") }}</span>
                <UpdatePetDetail v-if="!healthLoading" data="nextVaccine" :pet="pet" :isUpdating="isUpdating" />
            </div>
            <div class="profile-row">
                <span>{{ t("pet.profile.label.microchip") }}</span>
                <span v-if="pet.microchip && !isUpdating.microchip">{{ pet.microchip }}</span>
                <UpdatePetDetail data="microchip" :pet="pet" :isUpdating="isUpdating" />
            </div>
        </div>
    </div>
</template>