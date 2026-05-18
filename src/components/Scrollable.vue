<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps<{ list: any[] }>();

const cardSelector = ref<HTMLDivElement>();
const cardWidth = computed(() => cardSelector.value?.clientWidth || 384);
const activeIndex = ref(0);

const barWidth = computed(() => {
    if (!props.list.length) return 0;
    return 100 / props.list.length;
});

const handleScroll = () => {
    if (!cardSelector.value) return;
    const el = cardSelector.value;
    const scrollPosition = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const scrollPercent = scrollPosition / maxScroll;
    activeIndex.value = Math.round(scrollPercent * (props.list.length - 1));
};

const scrollToCard = (index: number) => {
    if (!cardSelector.value) return;
    cardSelector.value.scrollTo({
        left: index * cardWidth.value,
        behavior: "smooth"
    });
};

watch(
    () => props.list.length,
    async () => {
        await nextTick();
        handleScroll();
    },
    { immediate: true }
);
</script>


<template>
    <div class="relative">
        <div v-if="list.length > 1" class="flex gap-0.5 w-full mb-0.5 default-padding" aria-hidden>
            <button tabindex="0" v-for="(_item, index) in list" :key="index" ref="scrollBtn"
                class="h-0.25 default-transition rounded cursor-pointer"
                :class="index === activeIndex ? 'bg-brand' : 'bg-separator'" :style="{ width: `${barWidth}%` }"
                @click="scrollToCard(index)" />
        </div>
        <div class="pet-selector md:gap-1" ref="cardSelector" @scroll="handleScroll">
            <slot />
        </div>
    </div>
</template>

<style scoped>
button:focus-visible {
    outline: none;
    background: var(--color-brand-light);
}
</style>