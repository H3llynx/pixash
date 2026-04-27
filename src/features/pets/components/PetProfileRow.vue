<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Loading from '../../../components/loading/Loading.vue';
import { tsToDate } from '../../../utils';
import { usePets } from '../composables/usePets';
import type { PetExtended } from '../types';
import { getWeight } from '../utils';
import UpdatePetDetail from './UpdatePetDetail.vue';

const { healthLoading, selectedPet } = usePets();
const { t } = useI18n();

defineProps<{
    pet: PetExtended
    data: "weight" | "microchip" | "nextVaccine"
}>();

const isUpdating = defineModel();
</script>

<template>
    <div class="profile-row">
        <span>{{ t("pet.profile.label." + data) }}</span>
        <Loading v-if="data === 'nextVaccine' && pet === selectedPet && healthLoading" class="ml-auto" />
        <template v-else>
            <span v-if="pet[data] && !isUpdating" class="text-brand font-medium">
                {{ data === "nextVaccine"
                    ? pet.nextVaccine ? tsToDate(pet.nextVaccine.dueOn!, "date") : ""
                    : data === "weight" ? getWeight(pet) : pet[data]
                }}
            </span>
            <UpdatePetDetail v-model="isUpdating" :data="data" :pet="pet" />
        </template>
    </div>
</template>