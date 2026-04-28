<script setup lang="ts">
import EventCardSkeleton from './EventCardSkeleton.vue';

</script>

<template>
    <section class="animate-pulse w-full md:px-0 pet-section mb-4 md:mb-1">
        <div class="h-[10px] w-7 rounded bg-grey-light opacity-30 mb-1"></div>
        <EventCardSkeleton v-for="i in 3" :key="i" />
    </section>
</template>
