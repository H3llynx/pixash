<script setup lang="ts">
import { BriefcaseMedical, PawPrint, Stethoscope, Syringe } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMedia } from '../composables/useMedia';
import { usePets } from '../features/pets/composables/usePet';
import { resetState } from '../utils';
import Button from './Button.vue';

const { isAddingPet, isAddingHealth, isUpdatingPet } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const props = defineProps<{
    toggleRef: HTMLElement | null
    vet?: boolean
}>();
const visible = defineModel<boolean>("visible");

const menuRef = ref<HTMLUListElement | null>(null);

onClickOutside(menuRef, () => {
    if (visible.value) visible.value = false;
}, { ignore: [toRef(props, "toggleRef")] });

const handleClick = (action: string) => {
    resetState(isAddingHealth);
    isUpdatingPet.value = false;
    isAddingPet.value = false;
    if (action === "vaccine") isAddingHealth.vaccine = true;
    else if (action === "pet") isAddingPet.value = true;
    else if (action === "visit") isAddingHealth.visit = true;
    else if (action === "vet") { };
    visible.value = false;
}
</script>

<template>
    <Transition name="overlay">
        <div v-if="visible" class="fixed inset-0 w-full h-dvh bg-black/60">
            <Transition name="toast" appear>
                <div v-if="vet && !isMd" ref="menuRef"
                    class="flex flex-col items-end gap-1 max-w-2xs absolute bottom-11 md:bottom-7 right-1.5"
                    role="menu">
                    <div class="row">
                        <Button @click="handleClick('vet')">{{ t("addMenu.vet") }}</Button>
                        <BriefcaseMedical class="btn-icon default-transition filter-blur" :size="40" />
                    </div>
                </div>

                <div v-else ref="menuRef"
                    class="flex flex-col items-end gap-1 max-w-2xs absolute bottom-11 md:bottom-7 right-1.5"
                    role="menu">
                    <div class="row">
                        <Button @click="handleClick('pet')">{{ t("addMenu.pet") }}</Button>
                        <PawPrint class="btn-icon default-transition filter-blur" :size="40" />
                    </div>
                    <div class="row">
                        <Button @click="handleClick('vaccine')">{{ t("addMenu.vaccine") }}</Button>
                        <Syringe class="btn-icon default-transition filter-blur" :size="40" />
                    </div>
                    <div class="row">
                        <Button @click="handleClick('visit')">{{ t("addMenu.vetVisit") }}</Button>
                        <Stethoscope class="btn-icon default-transition filter-blur" :size="40" />
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
.row {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    &:hover .btn-icon {
        background: var(--color-btn-hover);
    }
}

.btn-icon {
    padding: 8px;
    border-radius: 50%;
    background: var(--color-brand-rgba);
    color: var(--color-white);
    border: 1px solid var(--color-brand);
}
</style>