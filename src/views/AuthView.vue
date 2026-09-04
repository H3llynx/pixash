<script setup lang="ts">
import SashaPixie from '../assets/sasha-pixie.png';
import Header from '../components/Header.vue';
import AuthForm from '../features/user/components/AuthForm.vue';
</script>

<template>
    <Header />
    <section class="m-auto max-w-full flex justify-center pb-6">
        <AuthForm />
        <img :src="SashaPixie" alt="" class="fixed -bottom-5 xl:-bottom-3 my-auto w-full -z-1 h-[60%] object-cover" />
    </section>
</template>

<style scoped>
img {
    filter: drop-shadow(0px 16px 60px var(--color-green));
}
</style>