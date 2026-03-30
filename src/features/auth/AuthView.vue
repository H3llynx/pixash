<script setup lang="ts">
import SashaPixie from '../../assets/sasha-pixie.png';
import AuthForm from './components/AuthForm.vue';
</script>

<template>
    <section aria-label="authentication" class="w-screen h-screen flex flex-col justify-center items-center">
        <AuthForm />
        <img :src="SashaPixie" alt="" class="absolute bottom-0 -z-1 w-3xl right-0 opacity-90" />
    </section>
</template>