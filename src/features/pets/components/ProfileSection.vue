<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { usePets } from '../composables/usePets';
import PetProfile from './PetProfile.vue';

const { selectedPet } = usePets();
const { t } = useI18n();
</script>

<template>
    <section class="pet-section">
        <template v-if="selectedPet">
            <h2>{{ t("dashboard.title.petProfile", { name: selectedPet.name }) }}</h2>
            <PetProfile :pet="selectedPet" />
        </template>
    </section>
</template>