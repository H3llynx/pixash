<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Header from '../components/header/Header.vue';
import HistorySkeleton from '../components/loading/HistorySkeleton.vue';
import { useMedia } from '../composables/useMedia';
import EventList from '../features/care/components/events/EventList.vue';
import EventSelector from '../features/care/components/events/EventSelector.vue';
import TreatmentList from '../features/care/components/treatments/TreatmentList.vue';
import { useHistory } from '../features/care/composables/useHistory.ts';
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
    <main v-else-if="hasPets" class="w-full">
        <PetSelector v-if="!isMd" class="w-full" />
        <EventSelector />
        <div class="flex flex-col gap-1.5 lg:grid lg:grid-cols-[55%_45%] lg:gap-0 md:pb-1">
            <EventList :events="filteredPetHistory" history />
            <TreatmentList v-if="finishedTreatments" :treatments="finishedTreatments" :title="t('events.treatments')"
                history class="default-padding lg:px-1.5" />
        </div>
    </main>
</template>