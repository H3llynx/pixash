<script setup lang="ts">
import EventCardSkeleton from './EventCardSkeleton.vue';

</script>

<template>
    <div
        class="animate-pulse flex flex-col gap-1.5 default-padding py-1 max-w-full overflow-hidden pb-6 md:pb-0 md:pl-21">
        <!-- Pet switcher chips -->
        <div class="flex gap-0.5">
            <div class="h-2 w-5 rounded-full bg-grey-light opacity-30"></div>
            <div class="h-2 w-5 rounded-full bg-grey-light opacity-20"></div>
        </div>
        <!-- Upcoming events -->
        <div class="flex flex-col gap-1">
            <EventCardSkeleton v-for="i in 4" :key="i" />
        </div>
    </div>
</template>