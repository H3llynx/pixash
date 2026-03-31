<script setup lang="ts">
import { Camera, Edit2, LogOut } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref, toRef } from 'vue';
import { useAuth } from '../features/auth/composables/useAuth';
import { ROUTES } from '../router/config';
import router from '../router/router';
import Button from './Button.vue';

const { logout } = useAuth();

const handleLogout = async () => {
    await logout();
    router.push(ROUTES.auth);
};

const props = defineProps<{
    visible: boolean
    toggleRef: HTMLElement | null
}>();
const emit = defineEmits(["update:visible"]);

const menuRef = ref<HTMLUListElement | null>(null);

onClickOutside(menuRef, () => {
    if (props.visible) {
        emit("update:visible", false)
    }
}, { ignore: [toRef(props, "toggleRef")] });

</script>

<template>
    <Transition name="toast">
        <ul v-if="visible" ref="menuRef" role="menu"
            class="absolute top-4 right-0 w-max bg-bg-rgba-reverse filter-blur rounded-lg">
            <li role="none">
                <Button role="menuitem" variant="ghost" size="xs" @click="handleLogout">
                    <LogOut :size="20" /> Log out
                </Button>
            </li>
            <li role="none">
                <Button role="menuitem" variant="ghost" size="xs">
                    <Camera :size="20" /> Update profile picture
                </Button>
            </li>
            <li role="none">
                <Button role="menuitem" variant="ghost" size="xs">
                    <Edit2 :size="18" /> Update name
                </Button>
            </li>
        </ul>
    </Transition>
</template>

<style scoped>
ul {
    &:focus-visible {
        border: 1px solid var(--color-gold);
    }

    button {
        display: flex;
        align-items: center;
        gap: 5px;
        text-align: left;

        svg {
            flex-shrink: 0;
        }
    }
}
</style>