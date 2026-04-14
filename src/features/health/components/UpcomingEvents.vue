<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../utils';
import { usePets } from '../../pets/composables/usePet';
import UpcomingCard from './UpcomingCard.vue';

const { t } = useI18n();
const { vaccines } = usePets();

const vaccinesToShow = computed(() => vaccines.value
    .filter(vaccine => tsToDate(vaccine.dueOn, "isUpcoming"))
    .sort((a, b) => a.dueOn!.seconds - b.dueOn!.seconds))
</script>

<template>
    <section class="pet-section md:w-max">
        <h2>{{ t("dashboard.title.upcoming") }}</h2>
        <UpcomingCard v-if="vaccinesToShow" v-for="vaccine in vaccinesToShow" :vaccine="vaccine" />
    </section>
</template>