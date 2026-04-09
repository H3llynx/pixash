<script setup lang="ts">
import ThemeSwitcher from '../features/theme/composants/ThemeSwitcher.vue';
import Greetings from '../features/user/components/Greetings.vue';
import UserPicture from '../features/user/components/UserPicture.vue';
import Logo from './Logo.vue';

withDefaults(defineProps<{ dashboard?: boolean }>(), { dashboard: false });
</script>

<template>'
    <header :class="{ 'flex text-brand justify-between': true, 'md:pl-18': dashboard }">
        <Greetings v-if="dashboard" />
        <Logo v-else />
        <div class="flex gap-0.5 relative z-2">
            <ThemeSwitcher />
            <UserPicture />
        </div>
    </header>
</template>