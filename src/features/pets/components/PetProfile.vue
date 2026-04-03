<script setup lang="ts">
import { Trash2 } from '@lucide/vue';
import Button from '../../../components/Button.vue';
import { useDialog } from '../../../composables/useDialog';
import { usePets } from '../composable/usePet';
import { getAge, getIcon, getWeight } from '../utils';
import UpdatePetDetail from './UpdatePetDetail.vue';

const { selectedPet, isUpdating, deleteSelectedPet } = usePets();
const { open } = useDialog();

const handleDelete = async () => {
    const pet = selectedPet.value;
    if (!pet) return;
    open({
        title: "Delete Maya?",
        message: `This will remove ${selectedPet.value?.name}'s profile and ${selectedPet.value?.sex === "male" ? "his" : "her"} tracked information. This action cannot be undone. Are you sure you'd like to proceed?`,
        isDelete: true,
        onConfirm: () => deleteSelectedPet(pet)
    });
};
</script>

<template>
    <section v-if="selectedPet" class="pet-section">
        <h2>{{ selectedPet.name }}'s profile</h2>
        <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 relative">
            <div class="flex justify-between items-center">
                <div class="rounded-full w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    {{ getIcon(selectedPet) }}
                </div>
                <div class="mr-auto p-1 text-text-secondary text-sm">
                    <h1>{{ selectedPet.name }}</h1>
                    <span v-if="selectedPet.breed" class="capitalize">{{ selectedPet.breed }} · </span>
                    <span>{{ getAge(selectedPet) }} · </span>
                    <span class="capitalize">{{ selectedPet.sex }}</span>
                </div>
            </div>
            <div class="text-sm">
                <div class="row">
                    <span>Weight</span>
                    <span v-if="selectedPet.weight && !isUpdating.weight">{{ getWeight(selectedPet) }}</span>
                    <UpdatePetDetail data="weight" />
                </div>
                <div class="row">
                    <span>Next vaccine</span>
                    <span class="text-brand font-medium">20 sep 1010</span>
                </div>
                <div class="row">
                    <span>Microchip</span>
                    <span v-if="selectedPet.microchip && !isUpdating.microchip">{{ selectedPet.microchip }}</span>
                    <UpdatePetDetail data="microchip" />
                </div>
            </div>
            <Button variant="ghost" size="xs" :aria-label="`Delete ${selectedPet.name}`"
                class="absolute top-0.5 right-0.5" @click="handleDelete">
                <Trash2 :size="22" color="var(--color-border)" />
            </Button>
        </div>
    </section>
</template>

<style scoped>
.row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    min-height: 2.25rem;
    padding: 5px 0;

    span:first-child {
        color: var(--color-text-secondary);
    }

    span:nth-of-type(2) {
        margin-left: auto;
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-separator)
    }
}
</style>