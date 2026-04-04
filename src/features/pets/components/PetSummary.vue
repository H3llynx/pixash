<script setup lang="ts">
import PetProfile from './PetProfile.vue';
import PetSelector from './PetSelector.vue';
</script>

<template>
    <div class="flex flex-col gap-1.5 flex-1 pb-6">
        <PetSelector />
        <PetProfile />
    </div>
</template>