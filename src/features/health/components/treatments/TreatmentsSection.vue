<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { usePets } from '../../../pets/composables/usePets';
import TreatmentCard from './TreatmentCard.vue';

const { treatments } = usePets();
const { t } = useI18n();
</script>

<template>
    <article class="pet-section">
        <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
        <div class="grid grid-cols-1 gap-1">
            <div v-for="treatment in treatments" :key="treatment.id" class="flex gap-0.5">
                <TreatmentCard :treatment="treatment" />
            </div>
        </div>
    </article>
</template>