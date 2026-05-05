<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HealthCard from '../../health/components/events/HealthCard.vue';
import { usePets } from '../composables/usePets';

const { selectedPet } = usePets();
const { t } = useI18n();
</script>

<template>
    <div v-if="selectedPet?.nextVaccine || selectedPet?.nextVetVisit || selectedPet?.nextAntiparasitic"
        class="pet-selector">
        <HealthCard v-if="selectedPet.nextVaccine" :pet="selectedPet" :data="selectedPet.nextVaccine"
            :title="t('dashboard.title.nextVaccine')" />
        <HealthCard v-if="selectedPet.nextVetVisit" :pet="selectedPet" :data="selectedPet.nextVetVisit"
            :title="t('dashboard.title.nextVetVisit')" />
        <HealthCard v-if="selectedPet.nextAntiparasitic" :pet="selectedPet" :data="selectedPet.nextAntiparasitic"
            :title="t('dashboard.title.nextAntiparasitic')" />
    </div>
</template>