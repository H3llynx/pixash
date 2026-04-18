<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMedia } from '../../../composables/useMedia';
import { usePets } from '../composables/usePet';
import PetProfile from './PetProfile.vue';

const { selectedPet, pets } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const petSelector = ref<HTMLDivElement>();
const showRightArrow = ref(false);
const showLeftArrow = ref(false);
const cardWidth = 384;

const handleScroll = () => {
    if (!petSelector.value) return;
    const el = petSelector.value;
    showLeftArrow.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 1;
    showRightArrow.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
};

const updateArrowState = async () => {
    await nextTick();
    handleScroll();
};

const scrollLeft = () => {
    if (!petSelector.value) return;
    petSelector.value.scrollBy({
        left: -cardWidth,
        behavior: "smooth"
    });
};

const scrollRight = () => {
    if (!petSelector.value) return;
    petSelector.value.scrollBy({
        left: cardWidth,
        behavior: "smooth"
    });
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
                    <button :class="{ 'left-arrow rounded-full': true, 'visible': showLeftArrow }" tabindex="0"
                        @click="scrollLeft" :aria-label="t('common.button.scrollLeft')">
                        <ChevronLeft :size="50" :class="{ visible: showLeftArrow }" />
                    </button>
                    <button :class="{ 'right-arrow rounded-full': true, 'visible': showRightArrow }" tabindex="0"
                        @click="scrollRight" :aria-label="t('common.button.scrollRight')">
                        <ChevronRight :size="50" />
                    </button>
                </div>
            </div>
        </template>
    </section>
</template>

<style scoped>
.left-arrow,
.right-arrow {
    position: absolute;
    z-index: 2;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: 0.4s ease-in-out;
    color: var(--color-gold);
    filter: drop-shadow(0 0 5px var(--color-bg));
    cursor: pointer;
}

.left-arrow {
    left: -3rem;
}

.right-arrow {
    right: 0.5rem;
}

.visible {
    opacity: 1;
}
</style>