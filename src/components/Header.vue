<script setup lang="ts">
import ThemeSwitcher from '../features/theme/composants/ThemeSwitcher.vue';
import Greetings from '../features/user/components/Greetings.vue';
import UserPicture from '../features/user/components/UserPicture.vue';
import Logo from './Logo.vue';

defineProps<{ type: "dashboard" | "calendar" | "auth" }>();
</script>

<template>
    <header
        :class="{ 'flex text-brand justify-between': true, 'md:pl-18': type === 'dashboard', 'bg-brand-dark md:justify-end': type === 'calendar' }">
        <Greetings v-if="type === 'dashboard'" />
        <Logo v-if="type !== 'dashboard'" class="md:hidden" />
        <div class="flex gap-0.5 relative z-2">
            <ThemeSwitcher />
            <UserPicture />
        </div>
    </header>
</template>