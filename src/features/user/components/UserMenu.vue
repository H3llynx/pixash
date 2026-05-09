<script setup lang="ts">
import { Camera, Edit2, LogOut } from '@lucide/vue';
import { onClickOutside, onKeyStroke } from '@vueuse/core';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap.js';
import { onMounted, onUnmounted, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { ROUTES } from '../../../router/config';
import router from '../../../router/router';
import { useAuth } from '../composables/useAuth';
import NameUpdate from './NameUpdate.vue';
import PictureUpdate from './PictureUpdate.vue';

const { logout } = useAuth();
const { t } = useI18n();

const props = defineProps<{
    toggleRef: HTMLElement | null
}>();

const visible = defineModel<boolean>("visible");
const menuRef = ref<HTMLUListElement | null>(null);
const isEditingName = ref<boolean>(false);
const isEditingPicture = ref<boolean>(false);

const { activate, deactivate } = useFocusTrap(menuRef, {
    immediate: true,
    clickOutsideDeactivates: true,
});
onKeyStroke("Escape", () => { visible.value = false; });

onClickOutside(menuRef, () => {
    visible.value = false;
}, { ignore: [toRef(props, "toggleRef")] });

const handleLogout = async () => {
    await logout();
    router.push(ROUTES.auth);
};

const handleEditName = () => {
    isEditingName.value = true;
    visible.value = false;
};

const handleEditPicture = () => {
    isEditingPicture.value = true;
    visible.value = false;
}

onMounted(() => {
    activate();
});

onUnmounted(() => {
    deactivate();
});
</script>

<template>
    <Transition name="toast">
        <ul v-if="visible" ref="menuRef" role="menu"
            class="absolute top-4 right-0 w-max filter-blur rounded-xl overflow-hidden border border-border bg-bg-rgba">
            <li role="none">
                <Button role="menuitem" variant="ghost" size="xs" @click="handleLogout">
                    <LogOut :size="20" /> {{ t("userMenu.logout") }}
                </Button>
            </li>
            <li role="none">
                <Button role="menuitem" variant="ghost" size="xs" @click="handleEditPicture">
                    <Camera :size="20" /> {{ t("userMenu.updatePicture") }}
                </Button>
            </li>
            <li role="none">
                <Button role="menuitem" variant="ghost" size="xs" @click="handleEditName">
                    <Edit2 :size="18" /> {{ t("userMenu.updateName") }}
                </Button>
            </li>
        </ul>
    </Transition>
    <NameUpdate v-model:nameVisible="isEditingName" />
    <PictureUpdate v-model:picVisible="isEditingPicture" />
</template>

<style scoped>
ul {
    li {
        padding: 3px;

        &:focus-within {
            background: var(--color-gold-rgba);
        }
    }

    button {
        text-align: left;
        background: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;

        svg {
            flex-shrink: 0;
        }

        &:focus-visible {
            outline: none;
        }
    }
}
</style>