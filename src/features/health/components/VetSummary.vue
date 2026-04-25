<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Scrollable from '../../../components/Scrollable.vue';
import { usePets } from '../../pets/composables/usePet';
import VetProfile from './VetProfile.vue';

const { vets } = usePets();
const { t } = useI18n();
</script>

<template>
    <section class="pet-section p-0">
        <h2 class="default-padding">{{ t("health.title.myVets") }}</h2>
        <Scrollable v-if="vets.length" :list="vets">
            <VetProfile v-for="vet in vets" :vet="vet" />
        </Scrollable>
        <p v-else class="text-text-secondary text-sm default-padding">{{ t("common.text.noVetText") }}</p>
    </section>
</template>

<style scoped>
:deep(.pet-selector) {
    touch-action: unset;
    scroll-snap-type: x mandatory;
}
</style>