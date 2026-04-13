<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
const { user } = useAuth();
</script>

<template>
    <div v-if="user">
        <span class="tracking-wide font-extralight md:text-lg">Welcome</span>
        <h2 class="text-2xl md:text-3xl">{{ user.firstName }}</h2>
    </div>
</template>