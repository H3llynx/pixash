<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from '../../../components/Button.vue';
import Paw from '../../../components/icons/Paw.vue';
import { ROUTES } from '../../../router/config';
import { usePets } from '../composables/usePets';
import type { PetExtended } from '../types';
import { getIcon } from '../utils';

const { pets, selectPet, selectedPet, selectedVet, isAddingPet } = usePets();
const { t } = useI18n();
const route = useRoute();

const props = withDefaults(defineProps<{
    form?: boolean
    nav?: boolean
    calendar?: boolean
    petId?: string
}>(), { form: false, calendar: false, nav: false });

const emit = defineEmits(["update:petId"]);

const filteredPets = computed(() => props.form && selectedVet.value
    ? pets.value.filter(pet => selectedVet.value?.assignedPets?.includes(pet.id))
    : pets.value);

const handleClick = (pet: PetExtended) => {
    selectPet(pet)
    if (props.calendar) emit("update:petId", pet.id);
};

const getPetChipStyle = (pet: PetExtended) => {
    if (props.nav) {
        if (props.calendar) return props.petId === pet.id ? "nav-active" : "nav-base";
        else return selectedPet.value?.id === pet.id ? "nav-active" : "nav-base";
    }
    else if (props.calendar) return props.petId === pet.id ? "calendar-active" : "calendar-base";
    else if (selectedPet.value?.id === pet.id) return "active";
};

const getAllChipStyle = () => {
    if (props.nav) return props.petId ? "nav-base" : "nav-active";
    else if (props.calendar) return props.petId ? "calendar-base" : "calendar-active";
    else if (!props.petId) return "active";
};

const getAddChipStyle = () => {
    if (props.nav) return `justify-start ${isAddingPet.value && "nav-active"}`;
    else if (isAddingPet.value) return "active";
}

</script>

<template>
    <div :class="nav ? 'pet-section md-nav-selector' : 'pet-selector'">
        <h2 v-if="nav" class="text-brand-light text-xs">{{ t("common.navbar.myPets") }}</h2>
        <Button v-if="calendar" :variant="nav ? 'ghost' : 'chip'" size="sm" :class="getAllChipStyle()"
            @click="emit('update:petId', undefined)">
            <Paw class="w-1 -rotate-20" /> {{ t("common.button.allChip") }}
        </Button>
        <Button :variant="nav ? 'ghost' : 'chip'" size="sm" v-for="pet in filteredPets" :class="getPetChipStyle(pet)"
            @click="handleClick(pet)" :disabled="route.path === ROUTES.vet">
            <span aria-hidden>{{ getIcon(pet) }}</span>
            {{ pet.name }}</Button>
        <Button v-if="!form && !calendar" :variant="nav ? 'add' : 'chip'" size="sm" :class="getAddChipStyle()"
            @click="isAddingPet = true">
            <Plus /> {{ t("common.button.add") }}
        </Button>
    </div>
</template>

<style scoped>
.active {
    background: var(--color-brand);
    color: var(--color-text-chip);
    border-color: var(--color-brand);
    font-weight: 500;
}

.nav-base,
.nav-active:disabled {
    background: transparent;
    color: var(--color-off-white);
    justify-content: flex-start;
}

.nav-active {
    background: var(--color-brand-rgba);
    color: var(--color-off-white);
    justify-content: flex-start;
    border-color: transparent;
}

.calendar-base {
    background: var(--color-brand-dark);
    border-color: var(--color-brand-rgba);
}

.calendar-active {
    background: var(--color-brand-light);
    border-color: var(--color-brand-light);
    color: var(--color-charcoal-lighter);
}

.md-nav-selector {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    padding-block: 1rem;
}
</style>