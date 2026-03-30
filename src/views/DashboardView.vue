<script setup lang="ts">
import Header from '../components/Header.vue';
import NavBar from '../components/NavBar.vue';
</script>

<template>
  <Header dashboard />
  <main>
    <div role="group" aria-label="Pet selector">
      <!-- Pet chips + add button -->
    </div>
    <section aria-label="pet summary">
      <!-- stat cards, pet switcher -->
    </section>
    <section aria-label="upcoming events">
      <!-- events list -->
    </section>
  </main>
  <NavBar />
</template>
