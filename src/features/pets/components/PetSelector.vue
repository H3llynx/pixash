<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Paw from '../../../components/icons/Paw.vue';
import { useAllPetsView } from '../../care/composables/useAllPetsView.ts';
import { usePets } from '../composables/usePets';
import type { PetExtended } from '../types';
import PetIcon from './PetIcon.vue';

const { pets, selectPet, selectedPet, selectedVet, isAddingPet } = usePets();
const { petViewed } = useAllPetsView();
const { t } = useI18n();

const props = withDefaults(defineProps<{
    stacked?: boolean;
    viewAll?: boolean;
}>(), { stacked: false, viewAll: false });

const filteredPets = computed(() => props.stacked && selectedVet.value
    ? pets.value.filter(pet => selectedVet.value?.assignedPets?.includes(pet.id))
    : pets.value);

const handleClick = (pet: PetExtended) => {
    selectPet(pet)
    if (props.viewAll) petViewed.value = pet.id;
};

const getPetChipStyle = (pet: PetExtended) => {
    if (props.viewAll) return petViewed.value === pet.id ? "active" : "";
    else if (selectedPet.value?.id === pet.id) return "active";
};

const getAllChipStyle = () => {
    if (props.viewAll) return !petViewed.value ? "active" : "";
};
</script>

<template>
    <span class="sr-only" aria-live="polite">
        {{viewAll
            ? petViewed
                ? t("common.a11y.petSelected", { name: filteredPets.find(p => p.id === petViewed)?.name })
                : t("common.a11y.allPetsSelected")
            : selectedPet ? t("common.a11y.petSelected", { name: selectedPet.name }) : ""
        }}
    </span>
    <div class="pet-selector" role="group" aria-label="select another pet">
        <Button v-if="viewAll" variant="tile" :size="stacked ? 'md' : 'tile'" :class="getAllChipStyle()"
            @click="petViewed = ''" :aria-pressed="petViewed === ''">
            <div class="inline-flex gap-0.5">
                <Paw class="w-1 -rotate-20" /> {{ t("common.button.all") }}
            </div>
        </Button>
        <Button :variant="stacked ? 'stacked' : 'tile'" :size="stacked ? 'xs' : 'tile'" v-for="pet in filteredPets"
            :class="getPetChipStyle(pet)" @click="handleClick(pet)"
            :aria-pressed="viewAll ? pet.id === petViewed : pet === selectedPet">
            <div :class="stacked ? 'chip-photo' : 'btn-layer'">
                <img v-if="pet.photo" :src="pet.photo" :alt="pet.name" class="w-full h-full object-cover" aria-hidden />
                <PetIcon v-else :pet="pet" class="m-0.5 text-3xl" />
            </div>
            {{ pet.name }}
        </Button>
        <Button v-if="!viewAll && !stacked" variant="add" size="tile" :class="{ 'tile': true, 'active': isAddingPet }"
            @click="isAddingPet = true">
            <Plus /> {{ t("common.button.add") }}
        </Button>
    </div>
</template>

<style scoped>
.btn-layer {
    position: absolute;
    inset: 0;
    z-index: -1;

    &:has(img)::after {
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

button:hover .chip-photo {
    background: var(--color-accent-rgba);
}

button.active .chip-photo {
    background: var(--color-accent);
}
</style>