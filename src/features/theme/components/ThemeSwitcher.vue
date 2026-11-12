<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue';
import { useRoute } from 'vue-router';
import Button from '../../../components/Button.vue';
import { ROUTES } from '../../../router/config.ts';
import { useTheme } from '../composables/useTheme.ts';

const { setTheme, theme } = useTheme();
const route = useRoute();

const switchTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>

<template>
    <Button :variant="route.path === ROUTES.landing ? 'tertiary' : 'ghost'" size="xs" class="aspect-square"
        @click="switchTheme" :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'">
        <Moon v-if="theme === 'light'" />
        <Sun v-else />
    </Button>
</template>