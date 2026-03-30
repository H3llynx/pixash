<script setup lang="ts">
import { useAuth } from '../features/auth/composables/useAuth';
const { user } = useAuth();
</script>

<template>
    <div v-if="user">
        <span class="text-sm tracking-wide font-extralight">Welcome</span>
        <h2 class="text-2xl font-title text-title">{{ user.firstName }}</h2>
    </div>
</template>