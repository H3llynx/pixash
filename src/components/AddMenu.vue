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
        <div v-if="visible" ref="menuRef" class="fixed inset-0 w-full h-dvh bg-black/60">
            <Transition name="toast" appear>
                <div class="flex flex-col gap-1 max-w-2xs absolute bottom-11 md:bottom-7 right-1.5" role="menu">
                    <Button size="sm" @click="handleClick('pet')">{{ t("pet.title.addPet") }}
                        <PawPrint class="btn-icon default-transition" :size="35" />
                    </Button>
                    <Button size="sm" @click="handleClick('vaccine')">{{ t("health.title.addVaccine") }}
                        <Syringe class="btn-icon default-transition" :size="35" />
                    </Button>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
button {
    gap: 1rem;

    &:hover .btn-icon {
        border-color: var(--color-btn-hover-text);
        background: var(--color-gold-rgba)
    }
}

.btn-icon {
    margin-left: auto;
    padding: 5px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid transparent;
}
</style>