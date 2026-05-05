<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../utils';
import { useVaccineForm } from '../../health/composables/useVaccineForm';
import type { PetExtended } from '../types';
import { getWeight } from '../utils';
import UpdatePetDetail from './UpdatePetDetail.vue';

const { vaccineLoading } = useVaccineForm();
const { t } = useI18n();

defineProps<{
    pet: PetExtended
    data: "weight" | "microchip" | "nextVaccine"
}>();
const isUpdating = defineModel();
</script>

<template>
    <div class="profile-row">
        <span>{{ t("pet.profile.labels." + data) }}</span>
        <span v-if="pet[data] && !isUpdating" class="font-medium">
            {{ data === "nextVaccine"
                ? pet.nextVaccine ? tsToDate(pet.nextVaccine.dueOn!, "date") : ""
                : data === "weight" ? getWeight(pet) : pet[data]
            }}
        </span>
        <UpdatePetDetail v-model="isUpdating" :data="data" :pet="pet" />
    </div>
</template>