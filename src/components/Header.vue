<script setup lang="ts">
import { LogOut } from '@lucide/vue';
import { useAuth } from '../features/auth/composables/useAuth';
import { ROUTES } from '../router/config';
import router from '../router/router';
import Button from './Button.vue';
const { user, logout } = useAuth();

const handleLogout = async () => {
    await logout();
    router.push(ROUTES.auth);
};
</script>

<template>
    <header v-if="user" class="flex w-screen p-1 text-brand justify-between">
        <div>
            <span class="text-sm tracking-wide font-extralight">Welcome</span>
            <h2 class="text-2xl font-title text-title">{{ user.firstName }}</h2>
        </div>
        <div class="rounded-full w-4 h-4 overflow-hidden bg-brand flex items-center justify-center">
            <img v-if="user.photo" :src="user.photo" :alt="user.firstName ?? 'user avatar'" />
            <p v-else class="text-gold capitalize text-3xl">{{ user.firstName.slice(0, 1) }}
            </p>
        </div>
        <Button aria-label="log out" variant="ghost" size="sm">
            <LogOut @click="handleLogout" />
        </Button>
    </header>
</template>