<script setup lang="ts">
import { ChevronRight } from '@lucide/vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePets } from '../composables/usePet';
import PetProfile from './PetProfile.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMd = breakpoints.greaterOrEqual("md");

const { selectedPet, pets } = usePets();
const { t } = useI18n();

const petSelector = ref<HTMLDivElement>();
const showRightArrow = ref(false);

const handleScroll = () => {
    if (!petSelector.value) return;
    const el = petSelector.value;
    showRightArrow.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
};

const updateArrowState = async () => {
    await nextTick();
    handleScroll();
};

watch(
    () => pets.value?.length,
    updateArrowState,
    { immediate: true }
);
</script>

<template>
    <section class="pet-section md:pr-0">
        <template v-if="selectedPet && !isMd">
            <h2>{{ t("dashboard.title.petProfile", { name: selectedPet.name }) }}</h2>
            <PetProfile :pet="selectedPet" />
        </template>

        <template v-else>
            <h2>{{ t("dashboard.title.petProfiles") }}</h2>
            <div class="relative">
                <div class="pet-selector pl-0" ref="petSelector" @scroll="handleScroll">
                    <PetProfile v-for="pet in pets" :pet="pet" />
                    <ChevronRight class="right-arrow rounded-full" :size="50" :class="{ visible: showRightArrow }" />
                </div>
            </div>
        </template>
    </section>
</template>

<style scoped>
.right-arrow {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: 0.4s ease-in-out;
    color: var(--color-gold);
    filter: drop-shadow(0 0 5px var(--color-bg));
}

.right-arrow.visible {
    opacity: 1;
    pointer-events: none;
}
</style>