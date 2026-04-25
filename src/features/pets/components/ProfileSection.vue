<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Scrollable from '../../../components/Scrollable.vue';
import { useMedia } from '../../../composables/useMedia';
import { usePets } from '../composables/usePet';
import PetProfile from './PetProfile.vue';

const { selectedPet, pets } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();
</script>

<template>
    <section class="pet-section md:pr-0">
        <template v-if="selectedPet && !isMd">
            <h2>{{ t("dashboard.title.petProfile", { name: selectedPet.name }) }}</h2>
            <PetProfile :pet="selectedPet" />
        </template>

        <template v-else>
            <h2>{{ t("dashboard.title.petProfiles") }}</h2>
            <Scrollable :list="pets">
                <PetProfile v-for="pet in pets" :pet="pet" />
            </Scrollable>
        </template>
    </section>
</template>