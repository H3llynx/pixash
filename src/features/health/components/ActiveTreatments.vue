<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { usePets } from '../../pets/composables/usePets';
import TreatmentProgress from './TreatmentProgress.vue';

const { treatments } = usePets();
const { t } = useI18n();

</script>

<template>
    <section class="pet-section md:px-0">
        <template v-if="treatments.length">
            <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
            <TreatmentProgress v-for="treatment in treatments" :key="treatment.id" :treatment="treatment" />
        </template>
    </section>
</template>