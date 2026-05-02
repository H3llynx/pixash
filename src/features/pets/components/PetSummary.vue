<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMedia } from '../../../composables/useMedia';
import HealthCard from '../../health/components/events/HealthCard.vue';
import { usePets } from '../composables/usePets';
import PetSelector from './PetSelector.vue';
import ProfileSection from './ProfileSection.vue';

const { selectedPet, pets } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const nextVaccineDue = computed(() => {
    return (pets.value
        .filter(pet => pet.nextVaccine)
        .sort((a, b) => a.nextVaccine!.dueOn!.seconds - b.nextVaccine!.dueOn!.seconds)[0])
});
const nextVisitDue = computed(() => {
    return (pets.value
        .filter(pet => pet.nextVetVisit)
        .sort((a, b) => a.nextVetVisit!.date!.seconds - b.nextVetVisit!.date!.seconds)[0])
});
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <PetSelector v-if="selectedPet && !isMd" />
        <div class="pet-selector md:gap-1">
            <template v-if="(selectedPet?.nextVaccine || selectedPet?.nextVetVisit) && !isMd">
                <HealthCard v-if="selectedPet.nextVaccine" :pet="selectedPet" :data="selectedPet.nextVaccine"
                    :title="t('pet.profile.label.nextVaccine')" :icon="false" />
                <HealthCard v-if="selectedPet.nextVetVisit" :pet="selectedPet" :data="selectedPet.nextVetVisit"
                    :title="t('pet.profile.label.nextVetVisit')" :icon="false" />
            </template>
            <template v-else-if="(nextVaccineDue || nextVisitDue) && isMd">
                <HealthCard v-if="nextVaccineDue" :pet="nextVaccineDue" :data="nextVaccineDue.nextVaccine!"
                    :title="t('pet.profile.label.nextVaccine')" />
                <HealthCard v-if="nextVisitDue" :pet="nextVisitDue" :data="nextVisitDue.nextVetVisit!"
                    :title="t('pet.profile.label.nextVetVisit')" />
            </template>
        </div>
        <ProfileSection />
    </div>
</template>