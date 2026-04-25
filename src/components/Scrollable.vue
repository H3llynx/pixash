<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{ list: any[] }>();

const cardSelector = ref<HTMLDivElement>();
const showRightArrow = ref(false);
const showLeftArrow = ref(false);
const cardWidth = computed(() => cardSelector.value?.clientWidth || 384);

const handleScroll = () => {
    if (!cardSelector.value) return;
    const el = cardSelector.value;
    showLeftArrow.value = el.scrollLeft > 0;
    showRightArrow.value = el.scrollLeft + el.clientWidth < el.scrollWidth;
};

const updateArrowState = async () => {
    await nextTick();
    handleScroll();
};

const scrollLeft = () => {
    if (!cardSelector.value) return;
    cardSelector.value.scrollBy({
        left: -cardWidth.value,
        behavior: "smooth"
    });
};

const scrollRight = () => {
    if (!cardSelector.value) return;
    cardSelector.value.scrollBy({
        left: cardWidth.value,
        behavior: "smooth"
    });
};

watch(
    () => props.list.length,
    updateArrowState,
    { immediate: true }
);
</script>


<template>
    <div class="relative">
        <div class="pet-selector md:gap-1" ref="cardSelector" @scroll="handleScroll">
            <slot />
            <button :class="{ 'left-arrow rounded-full': true, 'visible': showLeftArrow, 'hidden md:block': true }"
                tabindex="0" @click="scrollLeft" :aria-label="t('common.button.scrollLeft')">
                <ChevronLeft :size="50" :class="{ visible: showLeftArrow }" />
            </button>
            <button :class="{ 'right-arrow rounded-full': true, 'visible': showRightArrow, 'hidden md:block': true }"
                tabindex="0" @click="scrollRight" :aria-label="t('common.button.scrollRight')">
                <ChevronRight :size="50" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.left-arrow,
.right-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: 0.4s ease-in-out;
    color: var(--color-gold);
    filter: drop-shadow(0 0 5px var(--color-bg));
}

.left-arrow {
    left: 0rem;
}

.right-arrow {
    right: 0rem;
}

.visible {
    opacity: 1;
}
</style>