<script setup lang="ts">
import { CalendarCheck, Trash2 } from '@lucide/vue';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import FormWrapper from '../../../components/FormWrapper.vue';
import Input from '../../../components/Input.vue';
import { useDialog } from '../../../composables/useDialog';
import { useToast } from '../../../composables/useToast';
import { usePets } from '../../pets/composables/usePet';
import { vetVisitFields } from '../config';
import type { Pet, PetExtended } from '../../pets/types';
import PetSelector from '../../pets/components/PetSelector.vue';

const { pets, selectPet, selectedPet, isAddingHealth, healthLoading } = usePets();
const { show } = useToast();
const { open } = useDialog();
const { t } = useI18n();

const { title, date, vet, notes } = vetVisitFields;
const error = ref<boolean>(false)
const defaultForm = {
    title: "",
    date: "",
    vet: "",
    notes: "",
};
const formData = reactive({ ...defaultForm });
const resetForm = () => {
    Object.assign(formData, defaultForm)
};

const handleClose = () => {
    isAddingHealth.visit = false;
};

const handleSubmit = async () => {
    if (!selectedPet.value) return;
    /*     try {
            if (isAddingHealth.vaccine) {
                await addNewVaccine({ ...formData }, selectedPet.value.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.vaccineAdded", { name: selectedPet.value.name, type: showTypes(formData.types, selectedPet.value) }),
                });
            }
            else if (selectedVaccine.value && !shallowEqual(formData, selectedVaccine.value)) {
                await updateSelectedVaccine(selectedVaccine.value, selectedPet.value.id, { ...formData });
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.vaccineUpdated", { name: selectedPet.value.name, type: showTypes(formData.types, selectedPet.value) }),
                });
            }
        }
        catch (e) {
            show({ type: "error", title: "Error", message: healthError.value || "" });
        }; */
};
</script>

<template>
    <Transition name="panel">
        <FormWrapper v-if="isAddingHealth.visit" :onClose="handleClose">
            <div class="flex gap-1 justify-between my-1 default-padding">
                <h1>
                    {{ isAddingHealth.visit
                        ? t("health.title.addVetVisit")
                        : t("health.title.editVetVisit")
                    }}
                </h1>
                <Button class="ml-auto mb-auto" variant="ghost" size="xs" :aria-label="t('health.cta.delete')"
                    @click="">
                    <Trash2 :size="22" color="var(--color-brand-light)" />
                </Button>
            </div>
            <PetSelector />
            <form @submit.prevent="handleSubmit" class="mt-1">
                <div class="default-padding flex flex-col gap-0.5 min-w-">
                    <Input v-model="formData.title" :id="title.id" :type="title.type" :label="t(title.label)"
                        required />
                    <Input v-model="formData.date" :id="date.id" :label="t(date.label)" :type="date.type" required>
                        <template #addon>
                            <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                        </template>
                    </Input>
                    <Input v-model="formData.vet" :id="vet.id" :type="vet.type" :label="t(vet.label)" required />
                    <label :for="notes.id">
                        <p>{{ t(notes.label) }}</p>
                        <textarea v-model="formData.notes" :id="notes.id" />
                    </label>
                    <div class="flex gap-1 mt-1 items-center">
                        <Button size="sm" :disabled="healthLoading">{{ t("health.cta.save") }}</Button>
                    </div>
                </div>
            </form>
        </FormWrapper>
    </Transition>
</template>

<style scoped>
legend,
:deep(label p),
:deep(label span) {
    font-size: medium;
}

:deep(fieldset label p) {
    font-size: 14px;
}

:deep(label:has(input[type="text"]:not(:required)) p::after),
label:has(textarea) p::after {
    content: "(optional)";
    margin-left: 10px;
    color: var(--color-text-secondary);
    font-size: small;
}

;
</style>