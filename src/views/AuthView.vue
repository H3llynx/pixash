<script setup lang="ts">
import SashaPixie from '../assets/sasha-pixie.png';
import Header from '../components/Header.vue';
import AuthForm from '../features/user/components/AuthForm.vue';
</script>

<template>
    <Header />
    <section class="m-auto max-w-full flex justify-center pb-6">
        <AuthForm />
        <img :src="SashaPixie" alt="" class="fixed -bottom-3 left-0 -z-1 h-[60%] object-cover" />
    </section>
</template>