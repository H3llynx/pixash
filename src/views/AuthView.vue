<script setup lang="ts">
import SashaPixie from '../assets/sasha-pixie.png';
import Header from '../components/Header.vue';
import AuthForm from '../features/user/components/AuthForm.vue';
</script>

<template>
    <Header />
    <section aria-label="authentication" class="m-auto pb-6">
        <AuthForm />
        <img :src="SashaPixie" alt="" class="absolute bottom-0 -z-1 w-3xl right-0 opacity-90" />
    </section>
</template>