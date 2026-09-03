<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Header from '../components/Header.vue';
import HistorySkeleton from '../components/loading/HistorySkeleton.vue';
import EventList from '../features/care/components/events/EventList.vue';
import EventSelector from '../features/care/components/events/EventSelector.vue';
import TreatmentList from '../features/care/components/treatments/TreatmentList.vue';
import { useHistory } from '../features/care/composables/useHistory.ts';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';

const { loading, hasPets } = usePets();
const { filteredPetHistory, finishedTreatments } = useHistory();
const { t } = useI18n();

</script>

<template>
    <Header />
    <HistorySkeleton v-if="loading" />
    <main v-else-if="hasPets" class="w-full">
        <div class="default-padding">
            <h2 class="text-2xl md:text-3xl">{{ t("common.header.historyH2") }}</h2>
            <span class="tracking-wide font-extralight">{{ t("common.header.historySpan") }}</span>
        </div>
        <div class="flex flex-col gap-1.5 lg:lg-grid pb-1">
            <div>
                <PetSelector stacked />
                <EventSelector />
                <EventList :events="filteredPetHistory" history />
            </div>
            <TreatmentList v-if="finishedTreatments" :treatments="finishedTreatments" :title="t('events.treatments')"
                history class="default-padding lg:px-1.5" />
        </div>
    </main>
</template>