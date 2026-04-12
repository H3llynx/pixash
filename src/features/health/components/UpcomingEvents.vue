<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../utils';
import { usePets } from '../../pets/composables/usePet';
import { showTypes } from '../utils';
import EventCard from './EventCard.vue';

const { t } = useI18n();
const { vaccines, pets } = usePets();

const vaccinesToShow = vaccines.value
    .filter(vaccine => vaccine.dueOn)
    .map(vaccine => {
        const pet = pets.value.find(pet => pet.id === vaccine.petId);
        if (!pet) return null;
        const title = showTypes(vaccine.types, pet);
        const date = tsToDate(vaccine.dueOn, "date");
        if (!title || !date) return null;
        return { pet, title, date };
    })
    .filter(vaccine => vaccine !== null);
</script>

<template>
    <section class="pet-section md:w-max">
        <h2>{{ t("dashboard.title.upcoming") }}</h2>
        <EventCard v-if="vaccinesToShow" v-for="vaccine in vaccinesToShow" :title="vaccine.title" :date="vaccine.date"
            :pet="vaccine.pet" />
    </section>
</template>