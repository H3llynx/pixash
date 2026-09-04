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
    <main v-else-if="hasPets" class="lg:lg-grid xl:xl-grid">
        <section class="px-0 py-1">
            <div class="default-padding">
                <h2 class="text-2xl md:text-3xl">{{ t("common.header.historyH2") }}</h2>
                <span class="tracking-wide font-extralight">{{ t("common.header.historySpan") }}</span>
            </div>
            <PetSelector stacked />
            <EventSelector />
            <EventList :events="filteredPetHistory" history />
        </section>
        <div class="lg:bg-bg-3 lg:border-l lg:border-border lg:border-dashed lg:pt-1.5 pb-1.5">
            <TreatmentList v-if="finishedTreatments" :treatments="finishedTreatments" :title="t('events.treatments')"
                history class="default-padding lg:px-1.5" />
        </div>
    </main>
</template>