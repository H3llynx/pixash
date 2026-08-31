<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from '../../../components/Button.vue';
import Paw from '../../../components/icons/Paw.vue';
import { ROUTES } from '../../../router/config.ts';
import { usePets } from '../composables/usePets';
import type { PetExtended } from '../types';
import PetIcon from './PetIcon.vue';

const { pets, selectPet, selectedPet, selectedVet, isAddingPet } = usePets();
const { t } = useI18n();
const route = useRoute();

const props = withDefaults(defineProps<{
    form?: boolean
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
    if (props.calendar) return props.petId === pet.id ? "calendar-active" : "calendar-base";
    else if (selectedPet.value?.id === pet.id) return props.form ? "chip-active" : "active";
};

const getAllChipStyle = () => {
    if (props.calendar) return props.petId ? "calendar-base" : "calendar-active";
    else if (!props.petId) return "active";
};

const getAddChipStyle = () => {
    if (isAddingPet.value) return "active";
}

</script>

<template>
    <div class="pet-selector">
        <Button v-if="calendar" variant="petCard" size="sm" :class="getAllChipStyle()"
            @click="emit('update:petId', undefined)">
            <Paw class="w-1 -rotate-20" /> {{ t("common.button.allChip") }}
        </Button>
        <Button :variant="form ? 'petChip' : 'petCard'" :size="form ? 'xs' : 'sm'" v-for="pet in filteredPets"
            :class="getPetChipStyle(pet)" @click="handleClick(pet)" :disabled="pet === selectedPet && !calendar">
            <div v-if="pet.photo" :class="form ? 'chip-photo' : 'btn-layer'">
                <img :src="pet.photo" :alt="pet.name" class="w-full h-full object-cover" aria-hidden />
            </div>
            <PetIcon v-else :pet="pet" :class="form ? 'chip-photo text-3xl' : 'chip-photo'" />
            {{ pet.name }}
        </Button>
        <Button v-if="route.path === ROUTES.dashboard" variant="petCard" size="sm" :class="getAddChipStyle()"
            @click="isAddingPet = true">
            <Plus /> {{ t("common.button.add") }}
        </Button>
    </div>
</template>

<style scoped>
.chip-photo {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-layer {
    position: absolute;
    inset: 0;
    z-index: -1;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(160deg, transparent 40%, rgba(0, 0, 0, 0.8));
    }
}

button:not(.calendar-base):has(.btn-layer) {
    color: var(--color-white);
}

button:not(.active, .chip-active, .calendar-active) {

    .btn-layer,
    .chip-photo {
        opacity: 0.6;
    }

    .btn-layer img,
    .chip-photo img {
        filter: grayscale(0.9);
    }
}

.active,
.chip-active .chip-photo {
    background: var(--color-brand);
}

.active {
    color: var(--color-bg);
}

.chip-active {
    color: var(--color-brand);
}

.calendar-base {
    background: var(--color-brand-rgba);
    border-color: transparent;
    color: var(--color-text-secondary);
}

.calendar-active {
    background: var(--color-brand-light);
    border-color: var(--color-brand-light);
    color: var(--color-charcoal-lighter);
    cursor: not-allowed;
}

@media (width >=48rem) {
    .calendar-base:has(.btn-layer) {
        color: var(--color-border);
    }
}
</style>