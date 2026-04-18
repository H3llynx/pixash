<script setup lang="ts">
import { PawPrint, Syringe } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePets } from '../features/pets/composables/usePet';
import Button from './Button.vue';

const { isAddingPet, isAddingHealth } = usePets();
const { t } = useI18n();

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

const handleClick = (action: string) => {
    if (action === "vaccine") isAddingHealth.vaccine = true;
    else if (action === "pet") isAddingPet.value = true;
    emit("update:visible", false);
}
</script>

<template>
    <Transition name="overlay">
        <div v-if="visible" class="fixed inset-0 w-full h-dvh bg-black/60">
            <Transition name="toast" appear>
                <div ref="menuRef"
                    class="flex flex-col items-end gap-1 max-w-2xs absolute bottom-11 md:bottom-7 right-1.5"
                    role="menu">
                    <div class="row">
                        <Button @click="handleClick('pet')">{{ t("pet.title.addPet") }}</Button>
                        <PawPrint class="btn-icon default-transition filter-blur" :size="40" />
                    </div>
                    <div class="row">
                        <Button @click="handleClick('vaccine')">{{ t("health.title.addVaccine") }}</Button>
                        <Syringe class="btn-icon default-transition filter-blur" :size="40" />
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