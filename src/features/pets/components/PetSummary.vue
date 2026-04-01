<script setup lang="ts">
import PetProfile from './PetProfile.vue';
import PetSelector from './PetSelector.vue';
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <PetSelector />
        <PetProfile />
        <section aria-label="Upcoming events">
            <!-- events list -->
        </section>
    </div>
</template>