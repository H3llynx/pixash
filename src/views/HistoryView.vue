<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Header from '../components/header/Header.vue';
import HistorySkeleton from '../components/loading/HistorySkeleton.vue';
import { useMedia } from '../composables/useMedia';
import EventList from '../features/health/components/events/EventList.vue';
import EventSelector from '../features/health/components/events/EventSelector.vue';
import TreatmentList from '../features/health/components/treatments/TreatmentList.vue';
import { useHistory } from '../features/health/composables/useHistory';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';

const { loading, hasPets } = usePets();
const { filteredPetHistory, finishedTreatments } = useHistory();
const { isMd } = useMedia();
const { t } = useI18n();

</script>

<template>
    <Header />
    <HistorySkeleton v-if="loading" />
    <main v-else-if="hasPets" class="lg:grid lg:grid-cols-[55%_45%] lg:gap-0 md:pb-1">
        <div class="flex flex-col gap-1.5">
            <PetSelector v-if="!isMd" />
            <EventSelector />
            <EventList :events="filteredPetHistory" history />
        </div>
        <TreatmentList v-if="finishedTreatments" :treatments="finishedTreatments"
            :title="t('dashboard.title.pastTreatments')" history />
    </main>
</template>