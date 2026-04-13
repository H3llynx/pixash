<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../utils';
import { usePets } from '../../pets/composables/usePet';
import { showTypes } from '../utils';
import EventCard from './EventCard.vue';

const { t } = useI18n();
const { vaccines, pets } = usePets();

const vaccinesToShow = computed(() => vaccines.value
    .filter(vaccine => tsToDate(vaccine.dueOn, "isUpcoming"))
    .sort((a, b) => a.dueOn!.seconds - b.dueOn!.seconds)
    .map(vaccine => {
        const pet = pets.value.find(pet => pet.id === vaccine.petId);
        const title = showTypes(vaccine.types, pet);
        const date = tsToDate(vaccine.dueOn, "date") as string;
        if (!pet || !title || !date) return null;
        return { pet, title, date };
    })
    .filter(vaccine => vaccine !== null));
</script>

<template>
    <section class="pet-section md:w-max">
        <h2>{{ t("dashboard.title.upcoming") }}</h2>
        <EventCard v-if="vaccinesToShow" v-for="vaccine in vaccinesToShow" :event="vaccine" />
    </section>
</template>