<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Scrollable from '../../../../components/Scrollable.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useAllPetsView } from '../../composables/useAllPetsView.ts';
import VetCard from './VetCard.vue';

const { hasVets, isAddingCare } = usePets();
const { filteredVets } = useAllPetsView();
const { t } = useI18n();
</script>

<template>
    <section class="pet-section p-0">
        <h2 class="default-padding">{{ t("health.title.myVets") }}</h2>
        <Scrollable v-if="hasVets" :list="filteredVets">
            <VetCard v-if="hasVets" v-for="vet in filteredVets" :vet="vet" />
        </Scrollable>
        <div v-else class="default-padding">
            <Button variant="secondary" @click="isAddingCare.vet = true;">
                <Plus />{{ t("health.title.addVet") }}
            </Button>
        </div>
    </section>
</template>

<style scoped>
:deep(.pet-selector) {
    touch-action: unset;
    scroll-snap-type: x mandatory;
}
</style>