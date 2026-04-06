<script setup lang="ts">
import { Edit2, Trash2 } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useDialog } from '../../../composables/useDialog';
import { useToast } from '../../../composables/useToast';
import { tsToDate } from '../../../utils';
import { usePets } from '../composables/usePet';
import { getAge, getIcon, getWeight } from '../utils';
import UpdatePetDetail from './UpdatePetDetail.vue';

const { selectedPet, isUpdating, deleteSelectedPet } = usePets();
const { open } = useDialog();
const { show } = useToast();
const { t } = useI18n();

const handleDelete = async () => {
    const pet = selectedPet.value;
    if (!pet) return;
    open({
        title: t("dialog.deletePet.title"),
        message: t("dialog.deletePet.message", { name: pet.name }),
        isDelete: true,
        onConfirm: async () => {
            try {
                deleteSelectedPet(pet);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.petDeleted", { name: pet.name }),
                });
            } catch (error) { console.log(error) }
        }
    });
};
</script>

<template>
    <section v-if="selectedPet" class="pet-section">
        <h2>{{ selectedPet.name }}'s profile</h2>
        <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 relative">
            <div class="flex items-center gap-0.5">
                <div class="rounded-full w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    {{ getIcon(selectedPet) }}
                </div>
                <div class="p-1 text-text-secondary text-sm">
                    <div class="flex gap-0.5">
                        <h1>{{ selectedPet.name }}</h1>
                        <Button variant="ghost" size="xs"
                            :aria-label="t('pet.profile.edit.generalInformation', { name: selectedPet.name })"
                            @click="isUpdating.generalInfo = true">
                            <Edit2 :size="14" />
                        </Button>
                    </div>
                    <span v-if="selectedPet.breed" class="capitalize">{{ selectedPet.breed }} · </span>
                    <span>{{ getAge(selectedPet)?.text }} · </span>
                    <span class="capitalize">{{ selectedPet.sex }}</span>
                </div>
                <Button class="ml-auto mb-auto" variant="ghost" size="xs"
                    :aria-label="t('pet.cta.delete', { name: selectedPet.name })" @click="handleDelete">
                    <Trash2 :size="22" color="var(--color-border)" />
                </Button>
            </div>
            <div class="text-sm">
                <div class="row">
                    <span>{{ t("pet.profile.label.weight") }}</span>
                    <span v-if="selectedPet.weight && !isUpdating.weight">{{ getWeight(selectedPet) }}</span>
                    <UpdatePetDetail data="weight" />
                </div>
                <div class="row">
                    <span>{{ t("pet.profile.label.nextVaccine") }}</span>
                    <span v-if="selectedPet.nextVaccine" class="text-brand font-medium">{{
                        tsToDate(selectedPet.nextVaccine.dueOn!, "date")
                        }}</span>
                    <UpdatePetDetail data="nextVaccine" />
                </div>
                <div class="row">
                    <span>{{ t("pet.profile.label.microchip") }}</span>
                    <span v-if="selectedPet.microchip && !isUpdating.microchip">{{ selectedPet.microchip }}</span>
                    <UpdatePetDetail data="microchip" />
                </div>
            </div>
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