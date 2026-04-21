<script setup lang="ts">
import { BriefcaseMedical, Syringe } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { resetState } from '../../../utils';
import { usePets } from '../../pets/composables/usePet';

const { isAddingHealth } = usePets();
const { t } = useI18n();

const props = defineProps<{
    visible: boolean
}>();
const emit = defineEmits(["update:visible"]);

const menuRef = ref<HTMLUListElement | null>(null);

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
        <div v-if="visible" ref="menuRef" role="menu" class="absolute w-max flex flex-col gap-[5px]">
            <Button variant="ghost" size="xxs" @click="handleClick('vaccine')">
                <span>{{ t('addMenu.vaccine') }}</span>
                <Syringe class="btn-icon default-transition filter-blur" :size="16" />
            </Button>
            <Button variant="ghost" size="xxs" @click="handleClick('visit')">
                <span>{{ t('addMenu.vetVisit') }}</span>
                <BriefcaseMedical class="btn-icon default-transition filter-blur" :size="16" />
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