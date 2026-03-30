<script setup lang="ts">
import { LogOut } from '@lucide/vue';
import { ref } from 'vue';
import { useAuth } from '../features/auth/composables/useAuth';
import { ROUTES } from '../router/config';
import router from '../router/router';
import Button from './Button.vue';
const { user, logout } = useAuth();

const visible = ref(false);
const toggleVisible = () => visible.value = !visible.value

const handleLogout = async () => {
    await logout();
    router.push(ROUTES.auth);
};
</script>

<template>
    <button tabindex="0" @click="toggleVisible()" v-if="user"
        class="rounded-full w-3 h-3 overflow-hidden bg-brand flex items-center justify-center">
        <img v-if="user.photo" :src="user.photo" :alt="user.firstName ?? 'user avatar'" />
        <p v-else class="text-gold capitalize text-3xl">{{ user.firstName.slice(0, 1) }}
        </p>
    </button>
    <Button v-if="visible" variant="ghost" size="xs" class="flex items-center gap-[5px]" @click="handleLogout">
        <LogOut :size="20" /> Log out
    </Button>
</template>