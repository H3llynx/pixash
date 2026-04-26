<script setup lang="ts">
import { BriefcaseMedical, Edit2, Mail, Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useMedia } from '../../../composables/useMedia';
import { resetState } from '../../../utils';
import { usePets } from '../../pets/composables/usePets';
import AddVetDetail from './forms/AddVetDetail.vue';
import PetTag from './PetTag.vue';
import VetNotes from './VetNotes.vue';
import VetTypeTag from './VetTypeTag.vue';

const { pets, isAddingHealth, selectedVet, isUpdatingVet } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const props = defineProps<{ vet: any }>();

const assignedPets = computed(() => {
    return pets.value.filter(pet => props.vet.assignedPets.includes(pet.id));
});

const handleVisit = () => {
    selectedVet.value = props.vet;
    isUpdatingVet.value = false;
    isAddingHealth.visit = true;
}

const handleCall = () => {
    if (!props.vet.phone) return;
    window.location.href = `tel:${props.vet.phone}`;
}
const handleMail = () => {
    if (!props.vet.email) return;
    window.location.href = `mailto:${props.vet.email}`;
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
    <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-full md:w-sm shrink-0">
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
        <div class="text-sm">
            <div class="profile-row">
                <span>{{ t("vet.label.email") }}</span>
                <Button v-if="vet.email" variant="ghost" size="xs" class="truncate" @click="handleMail"
                    :aria-label="t('vet.cta.email', { name: vet.name })">
                    <Mail :size="16" class="shrink-0" />
                    <span :class="{ 'text-xs': isMd, truncate: true }">{{ vet.email }}</span>
                </Button>
                <AddVetDetail data="email" :vet="vet" v-else />
            </div>
            <div class="profile-row">
                <span>{{ t("vet.label.phone") }}</span>
                <span v-if="vet.phone" class="text-blue font-medium">{{ vet.phone }}</span>
                <AddVetDetail data="phone" :vet="vet" v-else />
            </div>
            <div class="profile-row">
                <span>{{ t("vet.label.hours") }}</span>
                <span v-if="vet.hours" :class="{ 'text-xs': isMd, 'text-right': true }">{{ vet.hours }}</span>
                <AddVetDetail data="hours" :vet="vet" v-else />
            </div>
        </div>
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