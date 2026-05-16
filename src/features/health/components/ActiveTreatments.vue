<script setup lang="ts">
import { Pill } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Loading from '../../../components/loading/Loading.vue';
import { usePets } from '../../pets/composables/usePets';

const { treatments, selectTreatment, healthLoading, selectedTreatment } = usePets();
const { t } = useI18n();

</script>

<template>
    <section class="pet-section">
        <template v-if="treatments.length">
            <h2>{{ t("dashboard.title.activeTreatments") }}</h2>
            <Button v-for="treatment in treatments" :key="treatment.id" variant="ghost"
                @click="selectTreatment(treatment)">
                <div class="rounded-xl w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    <Loading v-if="healthLoading && (selectedTreatment === treatment)" />
                    <Pill v-else />
                </div>
                <div>
                    <h3>{{ treatment.name }}</h3>
                    <p v-if="treatment.notes" class="text-text-secondary">{{ treatment.notes }}</p>
                </div>
            </Button>
        </template>
    </section>
</template>

<style scoped>
button {
    gap: 1rem;
}

@media (width >=48rem) {

    h3,
    p {
        font-size: clamp(0.85rem, 0.5vw, 1rem);
    }
}
</style>