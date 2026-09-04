<script setup lang="ts">
import type { CustomUser } from '../types';

defineProps<{ user: CustomUser }>();
</script>

<template>
    <img v-if="user.photo" :src="user.photo" :alt="user.firstName ?? 'user avatar'"
        class="w-full h-full object-cover relative" />
    <p v-else class="text-bg-2 capitalize text-xl">{{ user.firstName.slice(0, 1) }}</p>
</template>