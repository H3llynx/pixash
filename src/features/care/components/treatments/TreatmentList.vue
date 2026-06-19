<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import EventCardSkeleton from '../../../../components/loading/EventCardSkeleton.vue';
import { useMedia } from '../../../../composables/useMedia.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import type { TreatmentExtended } from '../../types.ts';
import TreatmentCard from './TreatmentCard.vue';

const { isMd } = useMedia();
const { t } = useI18n();
const { loading, selectedPet } = usePets();

const props = withDefaults(defineProps<{
    title?: string
    treatments: TreatmentExtended[]
    history?: boolean
    itemsPerPage?: number
}>(), { history: false });

const currentPage = ref<number>(1);
const itemsPerPage = computed(() => props.itemsPerPage ?? (isMd.value ? 2 : 3))

const totalPages = computed(() => Math.ceil(props.treatments.length / itemsPerPage.value));
const paginatedTreatments = computed(() => props.treatments.slice(
    (currentPage.value - 1) * itemsPerPage.value,
    currentPage.value * itemsPerPage.value
));

const goPrev = () => { if (currentPage.value > 1) currentPage.value-- };
const goNext = () => { if (currentPage.value < totalPages.value) currentPage.value++ };

watch(() => props.treatments, () => {
    currentPage.value = 1;
});
</script>

<template>
    <article class="pet-section">
        <h2 v-if="title">{{ title }}</h2>
        <div v-if="loading" class="flex flex-col gap-1">
            <EventCardSkeleton v-for="i in 3" :key="i" />
        </div>
        <div v-else class="grid grid-cols-1 gap-1">
            <TreatmentCard v-if="treatments.length" v-for="treatment in paginatedTreatments" :key="treatment.id"
                :treatment="treatment" />
            <p v-else-if="!loading && !history" class="text-text-secondary text-sm">{{
                t("common.text.noActiveTreatment",
                    { name: selectedPet?.name }) }}
            </p>
            <p v-else-if="!loading && history" class="text-text-secondary text-sm">{{
                t("common.text.noPastTreatments",
                    { name: selectedPet ? selectedPet.name : "Your pet" }) }}
            </p>
            <div v-if="totalPages > 1" class="flex gap-0.5 h-max justify-end mt-1">
                <Button variant="ghost" size="xs" :disabled="currentPage === 1" @click="goPrev"
                    :aria-label="t('common.button.back')">
                    <ChevronLeft />
                </Button>
                <Button variant="ghost" size="xs" :disabled="currentPage === totalPages" @click="goNext"
                    :aria-label="t('common.button.next')">
                    <ChevronRight />
                </Button>
            </div>
        </div>
    </article>
</template>