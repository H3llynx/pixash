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
    if (props.calendar) return props.petId === pet.id ? "active" : "";
    else if (selectedPet.value?.id === pet.id) return "active";
};

const getAllChipStyle = () => {
    if (props.calendar) return !props.petId ? "active" : "";
    else if (!props.petId) return "active";
};

console.log(props.petId)
</script>

<template>
    <span class="sr-only" aria-live="polite">
        {{calendar
            ? (props.petId
                ? t("common.a11y.petSelected", { name: filteredPets.find(p => p.id === props.petId)?.name })
                : t("common.a11y.allPetsSelected"))
            : (selectedPet ? t("common.a11y.petSelected", { name: selectedPet.name }) : "")
        }}
    </span>
    <div class="pet-selector" role="group" aria-label="select another pet">
        <Button v-if="calendar" variant="tile" size="tile" :class="getAllChipStyle()"
            @click="emit('update:petId', null)" :aria-pressed="props.petId === undefined">
            <Paw class="w-1 -rotate-20" /> {{ t("common.button.all") }}
        </Button>
        <Button :variant="form ? 'stacked' : 'tile'" :size="form ? 'xs' : 'tile'" v-for="pet in filteredPets"
            :class="getPetChipStyle(pet)" @click="handleClick(pet)"
            :aria-pressed="calendar ? pet.id === props.petId : pet === selectedPet">
            <div v-if="pet.photo" :class="form ? 'chip-photo' : 'btn-layer'">
                <img :src="pet.photo" :alt="pet.name" class="w-full h-full object-cover" aria-hidden />
            </div>
            <PetIcon v-else :pet="pet" />
            {{ pet.name }}
        </Button>
        <Button v-if="route.path === ROUTES.dashboard" variant="add" size="tile"
            :class="{ 'tile': true, 'active': isAddingPet }" @click="isAddingPet = true">
            <Plus /> {{ t("common.button.add") }}
        </Button>
    </div>
</template>

<style scoped>
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

.chip-photo {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>