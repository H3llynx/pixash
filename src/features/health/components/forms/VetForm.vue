<script setup lang="ts">
import { Trash2 } from '@lucide/vue';
import { reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FormWrapper from '../../../../components/FormWrapper.vue';
import Paw from '../../../../components/icons/Paw.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import { useDialog } from '../../../../composables/useDialog';
import { useToast } from '../../../../composables/useToast';
import { shallowEqual } from '../../../../utils';
import { usePets } from '../../../pets/composables/usePets';
import { getIcon } from '../../../pets/utils';
import { vetFormFields } from '../../config';
import type { Vet } from '../../types';
import { resetForm } from '../../utils';

const { pets, isAddingHealth, selectedVet, isUpdatingVet, healthLoading, healthError, addNewVet, updateSelectedVet, deleteSelectedVet } = usePets();
const { t } = useI18n();
const { show } = useToast();
const { open } = useDialog();

const { name, address1, address2, city, postCode, types, notes, assignedPets, phone, email, hours } = vetFormFields;
const addressTopFields = Object.entries({ address1, address2 });
const addressFlexFields = Object.entries({ postCode, city });
const contactFields = Object.entries({ phone, email });

const defaultForm: Vet = {
    name: "",
    address1: "",
    address2: "",
    city: "",
    postCode: "",
    types: [],
    notes: "",
    assignedPets: [],
    phone: "",
    email: "",
    hours: "",
};
const formData = reactive({ ...defaultForm });

const handleClose = () => {
    isUpdatingVet.value = false;
    isAddingHealth.vet = false;
    selectedVet.value = null;
};

const handleSubmit = async () => {
    try {
        if (isAddingHealth.vet) {
            await addNewVet({ ...formData });
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.nameAdded", { name: formData.name }),
            });
        } else if (selectedVet.value && !shallowEqual(formData, selectedVet.value)) {
            await updateSelectedVet(selectedVet.value, formData);
            isUpdatingVet.value = false;
            selectedVet.value = null
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.nameUpdated", { name: formData.name }),
            });
        }
    } catch (e) {
        show({ type: "error", title: t("error.genericTitle"), message: healthError.value || "" });
    }
};

const handleDelete = async () => {
    const vet = selectedVet.value;
    if (!vet) return;
    open({
        title: t("dialog.deleteVet.title", { name: vet.name }),
        message: t("dialog.deleteVet.message", { name: vet.name }),
        isDelete: true,
        onConfirm: async () => {
            try {
                await deleteSelectedVet(vet);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.nameDeleted", { name: vet.name }),
                });
            } catch (error) {
                show({ type: "error", title: t("error.genericTitle"), message: healthError.value || "" });
            }
        }
    });
};

watch(() => selectedVet.value,
    (vet) => {
        if (!vet) {
            resetForm(formData, defaultForm);
            return;
        }
        else {
            Object.assign(formData, {
                name: vet.name,
                address1: vet.address1,
                address2: vet.address2 ?? "",
                city: vet.city,
                postCode: vet.postCode,
                types: [...(vet.types ?? [])],
                notes: vet.notes ?? "",
                assignedPets: [...(vet.assignedPets ?? [])],
                phone: vet.phone ?? "",
                email: vet.email ?? "",
                hours: vet.hours ?? "",
            });
        }
    },
    { immediate: true }
);
</script>


<template>
    <Transition name="panel" appear>
        <FormWrapper v-if="isAddingHealth.vet || (selectedVet && isUpdatingVet)" :onClose="handleClose">
            <LoadingPuppy v-if="healthLoading" />
            <div v-else class="md:max-w-max">
                <div class="flex gap-1 justify-between my-1 default-padding items-center">
                    <h1>
                        {{ isAddingHealth.vet
                            ? t("health.title.addVet")
                            : t("health.title.editVet", { name: selectedVet!.name })
                        }}
                    </h1>
                    <Button v-if="selectedVet" class="ml-auto mb-auto" variant="ghost" size="xs"
                        :aria-label="t('health.cta.deleteVet')" @click="handleDelete">
                        <Trash2 :size="22" color="var(--color-brand-light)" />
                    </Button>
                </div>
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-model="formData.name" :id="name.id" :label="t(name.label)" required />
                        <Input v-for="[key, field] in addressTopFields" v-model="formData[key as keyof typeof formData]"
                            :key="field.id" :id="field.id" :label="t(field.label)" :required="field.required" />
                        <div class="flex gap-1">
                            <Input v-for="[key, field] in addressFlexFields"
                                v-model="formData[key as keyof typeof formData]" :key="field.id" :id="field.id"
                                :label="t(field.label)" :required="field.required"
                                :inputmode="(field as any).inputmode" />
                        </div>
                    </div>
                    <fieldset class="default-padding my-1">
                        <legend>{{ t(types.label) }}</legend>
                        <Input v-model="formData.types" v-for="option in types.options" :id="option.id"
                            :value="option.id" :key="option.id" :label="t(option.label)" :type="types.type" />
                    </fieldset>
                    <fieldset class="default-padding mb-1">
                        <legend>{{ t(assignedPets.label) }}</legend>
                        <Input v-model="formData.assignedPets" v-for="pet in pets" :id="pet.id" :value="pet.id"
                            :key="pet.id" :label="`${getIcon(pet)} ${pet.name}`" :type="assignedPets.type" />
                    </fieldset>
                    <div class="default-padding flex flex-col gap-1">
                        <label :for="notes.id">
                            <p>{{ t(notes.label) }}</p>
                            <textarea v-model="formData.notes" :id="notes.id" />
                        </label>
                        <Input v-for="[key, field] in contactFields" v-model="formData[key as keyof typeof formData]"
                            :key="field.id" :type="field.type" :id="field.id" :label="t(field.label)" />
                        <label :for="hours.id">
                            <p>{{ t(hours.label) }}</p>
                            <textarea v-model="formData.hours" :id="hours.id" />
                        </label>
                        <Button size="sm" :disabled="healthLoading" class="md:ml-auto">{{ t("health.cta.saveVet",
                            { name: formData.name }) }}
                            <Paw class="w-1 -rotate-12" />
                        </Button>
                    </div>
                </form>
            </div>
        </FormWrapper>
    </Transition>
</template>