<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import UserMenu from './UserMenu.vue';

const { user } = useAuth();
const visible = ref<boolean>(false);
const menuBtnRef = ref<HTMLButtonElement | null>(null);

</script>

<template>
    <div class="relative">
        <button tabindex="0" @click="visible = !visible" v-if="user" ref="menuBtnRef"
            class="rounded-full w-3.5 h-3.5 shrink-0 overflow-hidden bg-brand flex items-center justify-center">
            <img v-if="user.photo" :src="user.photo" :alt="user.firstName ?? 'user avatar'"
                class="w-full h-full object-cover" />
            <p v-else class="text-text-chip capitalize text-3xl">{{ user.firstName.slice(0, 1) }}
            </p>
        </button>
        <UserMenu v-model:visible="visible" :toggleRef="menuBtnRef" />
    </div>
</template>