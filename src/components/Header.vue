<script setup lang="ts">
import Greetings from './Greetings.vue';
import Logo from './Logo.vue';
import ProfilePicture from './ProfilePicture.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';

const props = withDefaults(defineProps<{ dashboard?: boolean }>(), { dashboard: false });
</script>

<template>
    <header class="flex text-brand justify-between">
        <Greetings v-if="dashboard" />
        <Logo v-else />
        <div class="flex gap-0.5">
            <ThemeSwitcher />
            <ProfilePicture />
        </div>
    </header>
</template>