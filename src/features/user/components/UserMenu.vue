<script setup lang="ts">
import { Camera, Edit2, LogOut } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { ROUTES } from '../../../router/config';
import router from '../../../router/router';
import { useAuth } from '../composables/useAuth';

const { logout } = useAuth();
const { t } = useI18n();

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
        emit("update:visible", false);
    }
}, { ignore: [toRef(props, "toggleRef")] });

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
                <Button role="menuitem" variant="ghost" size="xs">
                    <Camera :size="20" /> {{ t("userMenu.updatePicture") }}
                </Button>
            </li>
            <li role="none">
                <Button role="menuitem" variant="ghost" size="xs">
                    <Edit2 :size="18" /> {{ t("userMenu.updateName") }}
                </Button>
            </li>
        </ul>
    </Transition>
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