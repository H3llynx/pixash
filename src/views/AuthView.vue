<script setup lang="ts">
import SashaPixie from '../assets/sasha-pixie.png';
import Header from '../components/Header.vue';
import AuthForm from '../features/user/components/AuthForm.vue';
</script>

<template>
    <Header type="auth" />
    <section class="m-auto flex justify-center pb-6">
        <AuthForm />
        <img :src="SashaPixie" alt="" class="absolute bottom-0 -z-1 w-3xl right-0 opacity-90" />
    </section>
</template>