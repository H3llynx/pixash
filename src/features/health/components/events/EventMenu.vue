<script setup lang="ts">
import { Pill, Stethoscope, Syringe } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { useMedia } from '../../../../composables/useMedia';
import { resetState } from '../../../../utils';
import { usePets } from '../../../pets/composables/usePets';

const { isAddingHealth } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const visible = defineModel<boolean>("visible")

const menuRef = ref<HTMLDivElement>();
onClickOutside(menuRef, () => {
    if (visible.value) visible.value = false;
});

const handleClick = (action: string) => {
    resetState(isAddingHealth);
    if (action === "vaccine") isAddingHealth.vaccine = true;
    else if (action === "visit") isAddingHealth.visit = true;
    else if (action === "antiparasitic") isAddingHealth.antiparasitic = true;
    visible.value = false;
}
</script>

<template>
    <Transition name="toast">
        <div v-if="visible" ref="menuRef" role="menu" class="absolute -translate-x-1/2 w-max flex gap-[3px] flex-col">
            <Button variant="ghost" size="xxs" @click="handleClick('vaccine')" :aria-label="t('addMenu.vaccine')">
                <span v-if="isMd">{{ t("addMenu.vaccine") }}</span>
                <Syringe :size="isMd ? 18 : 20" />
            </Button>
            <Button variant="ghost" size="xxs" @click="handleClick('visit')" :aria-label="t('addMenu.vetVisit')">
                <span v-if="isMd">{{ t("addMenu.vetVisit") }}</span>
                <Stethoscope :size="isMd ? 18 : 20" />
            </Button>
            <Button variant="ghost" size="xxs" @click="handleClick('antiparasitic')"
                :aria-label="t('addMenu.antiparasitic')">
                <span v-if="isMd">{{ t("addMenu.antiparasitic") }}</span>
                <Pill :size="isMd ? 18 : 20" />
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