<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Scrollable from '../../../components/Scrollable.vue';
import { usePets } from '../../pets/composables/usePets';
import VetProfile from './VetProfile.vue';

const { vets, hasVets, isAddingHealth } = usePets();
const { t } = useI18n();
</script>

<template>
    <section class="pet-section p-0 mb-4 md:mb-1">
        <h2 class="default-padding">{{ t("health.title.myVets") }}</h2>
        <Scrollable v-if="hasVets" :list="vets">
            <VetProfile v-for="vet in vets" :vet="vet" />
        </Scrollable>
        <div v-else class="default-padding">
            <Button variant="secondary" @click="isAddingHealth.vet = true;">
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