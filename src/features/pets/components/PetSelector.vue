<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Paw from '../../../components/icons/Paw.vue';
import { useMedia } from '../../../composables/useMedia';
import { usePets } from '../composables/usePets';
import type { PetExtended } from '../types';
import { getIcon } from '../utils';

const { pets, selectPet, selectedPet, selectedVet, isAddingPet } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const props = withDefaults(defineProps<{
    form?: boolean
    calendar?: boolean
    petId?: string
}>(), { form: false, calendar: false });

const emit = defineEmits(["update:petId"]);

const getChipStyle = (pet: PetExtended) => ({
    active:
        (!props.calendar && selectedPet.value?.id === pet.id) ||
        (props.calendar && props.petId === pet.id),
    "active-calendar":
        !isMd.value && props.calendar && props.petId === pet.id,
    calendar:
        !isMd.value && props.calendar && props.petId !== pet.id,
});

const filteredPets = computed(() => props.form && selectedVet.value
    ? pets.value.filter(pet => selectedVet.value?.assignedPets?.includes(pet.id))
    : pets.value);

const handleClick = (pet: PetExtended) => {
    selectPet(pet)
    if (props.calendar) emit("update:petId", pet.id);
};
</script>

<template>
    <div class="pet-selector">
        <Button v-if="calendar" variant="chip" size="sm"
            :class="petId ? (!isMd && 'calendar') : (isMd ? 'active' : 'active-calendar')"
            @click="emit('update:petId', undefined)">
            <Paw class="w-1 -rotate-20" /> {{ t("common.button.allChip") }}
        </Button>
        <Button variant="chip" size="sm" v-for="pet in filteredPets" :class="getChipStyle(pet)"
            @click="handleClick(pet)">
            <span aria-hidden>{{ getIcon(pet) }}</span>
            {{ pet.name }}</Button>
        <Button v-if="!form && !calendar" variant="chip" size="sm" :class="{ active: isAddingPet }"
            @click="isAddingPet = true">
            <Plus /> {{ t("common.button.addChip") }}
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

.active-calendar {
    background: var(--color-brand-rgba);
    border-color: var(--color-btn-hover-text);
    color: var(--color-btn-hover-text)
}

.calendar {
    background: var(--color-brand-dark);
    border-color: var(--color-brand-rgba);
}
</style>