<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Scrollable from '../../../../components/Scrollable.vue';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import VetProfile from './VetProfile.vue';

const { vets, hasVets, isAddingCare, selectedPet } = usePets();
const { t } = useI18n();

const filteredVets = computed(() => {
    return selectedPet.value ? vets.value.filter(vet => vet.assignedPets!.includes(selectedPet.value!.id)) : vets
});
</script>

<template>
    <section class="pet-section p-0">
        <PetSelector />
        <h2 class="default-padding">{{ t("health.title.myVets") }}</h2>
        <Scrollable v-if="hasVets" :list="vets">
            <VetProfile v-if="hasVets" v-for="vet in filteredVets" :vet="vet" />
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