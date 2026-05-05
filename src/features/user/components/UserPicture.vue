<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import Avatar from './Avatar.vue';
import UserMenu from './UserMenu.vue';

const { user } = useAuth();
const visible = ref<boolean>(false);
const menuBtnRef = ref<HTMLButtonElement | null>(null);

</script>

<template>
    <div class="relative">
        <button tabindex="0" @click="visible = !visible" v-if="user" ref="menuBtnRef"
            class="rounded-full w-3.5 h-3.5 shrink-0 overflow-hidden bg-brand flex items-center justify-center">
            <Avatar :user="user" />
        </button>
        <UserMenu v-model:visible="visible" :toggleRef="menuBtnRef" />
    </div>
</template>