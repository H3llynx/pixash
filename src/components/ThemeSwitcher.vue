<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue';
import { useTheme } from '../composables/useTheme';

const { setTheme, theme } = useTheme();
const switchTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>

<template>
    <button @click="switchTheme" :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'">
        <Moon v-if="theme === 'light'" />
        <Sun v-else />
    </button>
</template>