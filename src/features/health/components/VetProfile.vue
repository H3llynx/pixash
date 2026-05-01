<script setup lang="ts">
import { BriefcaseMedical, Edit2, Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { resetState } from '../../../utils';
import { usePets } from '../../pets/composables/usePets';
import PetTag from './PetTag.vue';
import VetNotes from './VetNotes.vue';
import VetProfileRow from './VetProfileRow.vue';
import VetTypeTag from './VetTypeTag.vue';

const { pets, selectPet, isAddingHealth, selectedVet, isUpdatingVet } = usePets();
const { t } = useI18n();

const props = defineProps<{ vet: any }>();

const assignedPets = computed(() => {
    return pets.value.filter(pet => props.vet.assignedPets.includes(pet.id));
});

const handleVisit = () => {
    resetState(isAddingHealth);
    selectedVet.value = props.vet;
    const pet = pets.value.find(p => props.vet.assignedPets.includes(p.id));
    if (pet) selectPet(pet);
    isUpdatingVet.value = false;
    isAddingHealth.visit = true;
}

const handleCall = () => {
    if (!props.vet.phone) return;
    window.location.href = `tel:${props.vet.phone}`;
}
const handleMaps = () => {
    const address = [props.vet.name, props.vet.address1, props.vet.address2, props.vet.postCode, props.vet.city]
        .filter(Boolean)
        .join(', ');
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
};

const handleVetUpdate = () => {
    resetState(isAddingHealth);
    selectedVet.value = props.vet;
    isUpdatingVet.value = true;
};
</script>

<template>
    <div class="profile-card w-full md:w-sm shrink-0">
        <div class="flex items-start gap-0.5 py-1">
            <div class="rounded-xl w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                <BriefcaseMedical />
            </div>
            <div class="px-1 text-text-secondary text-sm w-full">
                <div class="flex gap-0.5 items-start justify-between">
                    <h1>{{ vet.name }}</h1>
                    <Button variant="ghost" size="xs" :aria-label="t('vet.cta.edit', { name: vet.name })"
                        @click="handleVetUpdate">
                        <Edit2 :size="14" />
                    </Button>
                </div>
                <div class="flex flex-wrap gap-x-[5px]">
                    <span class="capitalize">{{ vet.address1 }}</span>
                    <span v-if="vet.address2" class="capitalize">{{ vet.address2 }}</span>
                    <span>{{ vet.postCode }}</span>
                    <span class="capitalize">{{ vet.city }}</span>
                </div>
            </div>
        </div>
        <div class="flex gap-0.5 items-center">
            <PetTag v-for="pet in assignedPets" :pet="pet" />
            <VetTypeTag v-for="type in vet.types" :type="type" />
        </div>
        <VetProfileRow data="email" :vet="vet" />
        <VetProfileRow data="phone" :vet="vet" />
        <VetProfileRow data="hours" :vet="vet" />
        <div class="mt-auto flex flex-col gap-0.5">
            <VetNotes :vet="vet" />
            <div class="flex gap-0.5 pt-1 border-t border-separator">
                <Button variant="vetOptions" size="vetOptions" @click="handleMaps">
                    {{ t("vet.cta.maps") }}
                </Button>
                <Button variant="vetOptions" size="vetOptions" @click="handleCall">
                    {{ t("vet.cta.call") }}
                </Button>
                <Button variant="vetOptions" size="vetOptions" @click="handleVisit">
                    <Plus :size="18" />
                    {{ t("vet.cta.visit") }}
                </Button>
            </div>
        </div>
    </div>
</template>