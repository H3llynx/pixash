<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../features/auth/composables/useAuth';
import ProfileMenu from './ProfileMenu.vue';

const { user } = useAuth();
const visible = ref(false);
const menuBtnRef = ref<HTMLButtonElement | null>(null);

</script>

<template>
    <div class="relative z-1">
        <button tabindex="0" @click="visible = !visible" v-if="user" ref="menuBtnRef"
            class="rounded-full w-3.5 h-3.5 shrink-0 overflow-hidden bg-brand flex items-center justify-center">
            <img v-if="user.photo" :src="user.photo" :alt="user.firstName ?? 'user avatar'" />
            <p v-else class="text-gold capitalize text-3xl">{{ user.firstName.slice(0, 1) }}
            </p>
        </button>
        <ProfileMenu v-model:visible="visible" :toggleRef="menuBtnRef" />
    </div>
</template>