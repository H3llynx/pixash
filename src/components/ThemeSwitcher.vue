<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue';
import { useTheme } from '../composables/useTheme';
import Button from './Button.vue';

const { setTheme, theme } = useTheme();
const switchTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>

<template>
    <Button variant="ghost" size="sm" @click="switchTheme"
        :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'">
        <Moon v-if="theme === 'light'" />
        <Sun v-else />
    </Button>
</template>