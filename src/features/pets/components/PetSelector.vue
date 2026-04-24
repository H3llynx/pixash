<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Paw from '../../../components/icons/Paw.vue';
import { useMedia } from '../../../composables/useMedia';
import { usePets } from '../composables/usePet';
import type { PetExtended } from '../types';
import { getIcon } from '../utils';

const { pets, selectPet, selectedPet, isAddingPet } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const props = withDefaults(defineProps<{
    form?: boolean
    calendar?: boolean
    petId?: string
}>(), { form: false, calendar: false });

const emit = defineEmits(["update:petId"]);

const handleClick = (pet: PetExtended) => {
    selectPet(pet)
    if (props.calendar) emit("update:petId", pet.id);
}
</script>

<template>
    <div class="pet-selector">
        <Button v-if="calendar" variant="chip" size="sm"
            :class="petId ? (!isMd && 'calendar') : (isMd ? 'active' : 'active-calendar')"
            @click="emit('update:petId', undefined)">
            <Paw class="w-1 -rotate-20" /> {{ t("common.button.allChip") }}
        </Button>
        <Button variant="chip" size="sm" v-for="pet in pets" :class="{
            active: (!calendar && selectedPet?.id === pet.id) || (calendar && petId === pet.id),
            'active-calendar': !isMd && calendar && petId === pet.id,
            'calendar': !isMd && calendar && petId !== pet.id
        }" @click="handleClick(pet)">
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