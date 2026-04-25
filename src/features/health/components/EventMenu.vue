<script setup lang="ts">
import { Stethoscope, Syringe } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useMedia } from '../../../composables/useMedia';
import { resetState } from '../../../utils';
import { usePets } from '../../pets/composables/usePet';

const { isAddingHealth } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const props = defineProps<{
    visible: boolean
}>();
const emit = defineEmits(["update:visible"]);

const menuRef = ref<HTMLDivElement>();
onClickOutside(menuRef, () => {
    if (props.visible) {
        emit("update:visible", false);
    }
});

const handleClick = (action: string) => {
    resetState(isAddingHealth);
    if (action === "vaccine") isAddingHealth.vaccine = true;
    else if (action === "visit") isAddingHealth.visit = true;
    emit("update:visible", false);
}
</script>

<template>
    <Transition name="toast">
        <div v-if="visible" ref="menuRef" role="menu" class="absolute w-max flex gap-[5px] md:flex-col">
            <Button variant="ghost" size="xxs" @click="handleClick('vaccine')" :aria-label="t('addMenu.vaccine')">
                <span v-if="isMd">{{ t("addMenu.vaccine") }}</span>
                <Syringe :size="18" />
            </Button>
            <Button variant="ghost" size="xxs" @click="handleClick('visit')" :aria-label="t('addMenu.vetVisit')">
                <span v-if="isMd">{{ t("addMenu.vetVisit") }}</span>
                <Stethoscope :size="18" />
            </Button>
        </div>
    </Transition>
</template>

<style scoped>
button {
    justify-content: space-between;

    border: 1px solid var(--color-border);

    &:hover {
        background: var(--color-brand-rgba)
    }
}
</style>