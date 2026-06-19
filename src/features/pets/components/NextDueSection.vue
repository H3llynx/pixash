<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import HealthCard from '../../care/components/events/HealthCard.vue';
import type { PetEvent } from '../../care/types.ts';
import { usePets } from '../composables/usePets';

const { selectedPet, handleAdd } = usePets();
const { t } = useI18n();
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
        <Button variant="add" class="hover-gradient w-1/2 md:w-14 flex-col h-6" @click="handleAdd('vaccine')">
            <span>{{ t("health.title.addVaccine") }}</span>
            <Plus color="var(--color-text-secondary)" />
        </Button>
        <Button variant="add" class="hover-gradient w-1/2 md:w-14 flex-col h-6" @click="handleAdd('visit')">
            <span>{{ t("health.title.addVetVisit") }}</span>
            <Plus color="var(--color-text-secondary)" />
        </Button>
        <Button variant="add" class="hover-gradient w-1/2 md:w-14 flex-col h-6" @click="handleAdd('antiparasitic')">
            <span>{{ t("health.title.logAntiparasitic") }}</span>
            <Plus color="var(--color-text-secondary)" />
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