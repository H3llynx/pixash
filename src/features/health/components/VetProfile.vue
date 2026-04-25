<script setup lang="ts">
import { BriefcaseMedical, Edit2, Mail, Plus } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useMedia } from '../../../composables/useMedia';
import { usePets } from '../../pets/composables/usePet';
import PetTag from './PetTag.vue';
import VetTypeTag from './VetTypeTag.vue';

const { pets, isAddingHealth, selectedVet } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const props = defineProps<{ vet: any }>();

const assignedPets = computed(() => {
    return pets.value.filter(pet => props.vet.assignedPets.includes(pet.id));
});

const handleVisit = () => {
    selectedVet.value = props.vet;
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
</script>

<template>
    <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 max-w-full md:w-sm md:shrink-0">
        <div class="flex items-start gap-0.5 py-1">
            <div class="rounded-xl w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                <BriefcaseMedical />
            </div>
            <div class="px-1 text-text-secondary text-sm">
                <div class="flex gap-0.5 items-start">
                    <h1>{{ vet.name }}</h1>
                    <Button variant="ghost" size="xs" :aria-label="t('vet.cta.edit', { name: vet.name })">
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
            <div class="profile-row" v-if="vet.email">
                <span>{{ t("vet.label.email") }}</span>
                <Button variant="ghost" size="xs" class="truncate" @click="handleMail"
                    :aria-label="t('vet.cta.email', { name: vet.name })">
                    <Mail :size="16" class="shrink-0" />
                    <span :class="{ 'text-xs': isMd, truncate: true }">{{ vet.email }}</span>
                </Button>
            </div>
            <div class="profile-row" v-if="vet.phone">
                <span>{{ t("vet.label.phone") }}</span>
                <span class="text-brand-light font-medium">{{ vet.phone }}</span>
            </div>
            <div class="profile-row" v-if="vet.hours">
                <span>{{ t("vet.label.hours") }}</span>
                <span :class="{ 'text-xs': isMd, 'text-right': true }">{{ vet.hours }}</span>
            </div>
        </div>
        <span v-if="vet.notes" class="text-sm py-0.5 px-1 text-text-secondary bg-bg rounded-lg">{{
            vet.notes
        }}</span>
        <div class="flex gap-0.5 mt-auto pt-1 border-t border-separator">
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
</template>