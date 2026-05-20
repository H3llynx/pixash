<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { resetState } from '../../../utils';
import HealthCard from '../../health/components/events/HealthCard.vue';
import type { PetEvent } from '../../health/types';
import { usePets } from '../composables/usePets';

const { selectedPet, isAddingHealth } = usePets();
const { t } = useI18n();

const handleClick = (action: string) => {
    resetState(isAddingHealth);
    if (action === "vaccine") isAddingHealth.vaccine = true;
    else isAddingHealth.visit = true;
}
</script>

<template>
    <div v-if="selectedPet?.nextVaccine || selectedPet?.nextVetVisit || selectedPet?.nextAntiparasitic"
        class="pet-selector lg:flex-wrap">
        <HealthCard v-if="selectedPet.nextVaccine" :pet="selectedPet" :data="selectedPet.nextVaccine"
            :title="t('dashboard.title.nextVaccine')" />
        <HealthCard v-if="selectedPet.nextVetVisit" :pet="selectedPet" :data="selectedPet.nextVetVisit"
            :title="t('dashboard.title.nextVetVisit')" />
        <HealthCard v-if="selectedPet.nextAntiparasitic" :pet="selectedPet"
            :data="(selectedPet.nextAntiparasitic as PetEvent)" :title="t('dashboard.title.nextAntiparasitic')" />
    </div>
    <div v-else class="flex gap-0.5 py-0.5 default-padding">
        <Button variant="add" class="w-1/2 md:w-14 flex-col h-6" @click="handleClick('vaccine')">
            <span>{{ t("health.title.addVaccine") }}</span>
            <Plus />
        </Button>
        <Button variant="add" class="w-1/2 md:w-14 flex-col h-6" @click="handleClick('visit')">
            <span>{{ t("health.title.addVetVisit") }}</span>
            <Plus />
        </Button>
    </div>
</template>

<style scoped>
span {
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-size: clamp(0.75rem, 0.5vw, 1rem);
}
</style>