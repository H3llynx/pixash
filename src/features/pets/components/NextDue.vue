<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useMedia } from '../../../composables/useMedia.ts';
import DueCard from '../../care/components/events/DueCard.vue';
import type { PetEvent } from '../../care/types.ts';
import { usePets } from '../composables/usePets.ts';

const { selectedPet, handleAdd } = usePets();
const { isLg } = useMedia();
const { t } = useI18n();
</script>

<template>
    <div class="pet-selector pb-0 lg:px-1.5">
        <template v-if="selectedPet?.nextVaccine || selectedPet?.nextVetVisit || selectedPet?.nextAntiparasitic">
            <DueCard v-if="selectedPet.nextVaccine" :pet="selectedPet" :data="selectedPet.nextVaccine"
                :title="t('dashboard.title.nextVaccine')" />
            <DueCard v-if="selectedPet.nextVetVisit" :pet="selectedPet" :data="selectedPet.nextVetVisit"
                :title="t('dashboard.title.nextVetVisit')" />
            <DueCard v-if="selectedPet.nextAntiparasitic" :pet="selectedPet"
                :data="(selectedPet.nextAntiparasitic as PetEvent)" :title="t('dashboard.title.nextAntiparasitic')" />
        </template>
        <template v-else>
            <Button variant="add" :size="isLg ? 'tile' : 'third'" class="flex-col" @click="handleAdd('vaccine')">
                <span>{{ t("health.title.addVaccine") }}</span>
                <Plus color="var(--color-text-secondary)" />
            </Button>
            <Button variant="add" :size="isLg ? 'tile' : 'third'" class="flex-col" @click="handleAdd('visit')">
                <span>{{ t("health.title.addVetVisit") }}</span>
                <Plus color="var(--color-text-secondary)" />
            </Button>
            <Button variant="add" :size="isLg ? 'tile' : 'third'" class="flex-col" @click="handleAdd('antiparasitic')">
                <span>{{ t("health.title.logAntiparasitic") }}</span>
                <Plus color="var(--color-text-secondary)" />
            </Button>
        </template>
    </div>
</template>

<style scoped>
span {
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-size: clamp(0.75rem, 0.5vw, 1rem);
}
</style>