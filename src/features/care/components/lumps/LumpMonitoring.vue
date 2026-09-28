<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useMedia } from '../../../../composables/useMedia.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import LumpCard from './LumpCard.vue';

const { selectedPet } = usePets();
const { isLg } = useMedia();
const { t } = useI18n();
</script>

<template>
    <section v-if="selectedPet?.lumps.length" class="pet-section p-0">
        <div :class="{ 'overlay': isLg }">
            <h2 class="default-padding">{{ t("dashboard.title.lumpMonitoring") }}</h2>
            <div class="pet-selector gap-1">
                <LumpCard v-for="lump in selectedPet.lumps" :key="lump.id" :lump="lump" />
            </div>
        </div>
    </section>
</template>