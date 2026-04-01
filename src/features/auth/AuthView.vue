<script setup lang="ts">
import SashaPixie from '../../assets/sasha-pixie.png';
import Header from '../../components/Header.vue';
import AuthForm from './components/AuthForm.vue';
</script>

<template>
    <Header />
    <section aria-label="authentication"
        class="w-screen m-auto py-1.5 px-2 md:px-3 pb-6 flex flex-col justify-center items-center">
        <AuthForm />
        <img :src="SashaPixie" alt="" class="absolute bottom-0 -z-1 w-3xl right-0 opacity-90" />
    </section>
</template>