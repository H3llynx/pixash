<script setup lang="ts">
import { CalendarCheck, Trash2 } from '@lucide/vue';
import { computed, provide, reactive, ref, Transition, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FormWrapper from '../../../../components/FormWrapper.vue';
import Paw from '../../../../components/icons/Paw.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import { useDialog } from '../../../../composables/useDialog';
import { useFormMode } from '../../../../composables/useFormMode';
import { useToast } from '../../../../composables/useToast';
import { shallowEqual, tsToDate } from '../../../../utils';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets';
import { getIcon } from '../../../pets/utils';
import { vetVisitFields } from '../../config';
import type { VisitExtended } from '../../types';
import { resetForm } from '../../utils';
import VetFormSelector from './VetFormSelector.vue';

const { selectedPet, selectedVisit, selectVisit, isAddingHealth, healthLoading, addNewVetVisit, updateSelectedVisit, deleteSelectedVisit, healthError, selectedDate, selectedVet, vets } = usePets();
const { show } = useToast();
const { open } = useDialog();
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
provide('readonly', isReadonly);

const { title, date, vet, notes } = vetVisitFields;
const vetTextInput = ref<boolean>(false);
const visitDate = computed(() => selectedDate.value ?? "");
const assignedVet = computed(() => {
    if (selectedVet.value) return selectedVet.value.id;
    const pet = selectedPet.value;
    if (pet) {
        const vetForPet = vets.value?.find(v => v.assignedPets?.includes(pet.id));
        if (vetForPet) return vetForPet.id;
    }
    return vets.value?.[0]?.id ?? "";
});
const defaultForm = {
    title: "",
    date: "",
    vet: "",
    notes: "",
};
const fillVisitData = (visit: Partial<VisitExtended>) => {
    const isRegisteredVet = vets.value?.some(vet => vet.id === visit.vet);
    vetTextInput.value = !isRegisteredVet;
    Object.assign(formData, {
        title: visit.title,
        date: tsToDate(visit.date, "input"),
        vet: visit.vet,
        notes: visit.notes ?? "",
    })
};

const formData = reactive({ ...defaultForm });
const isVisible = computed(() => isAddingHealth.visit || mode.value === 'edit');
const handleClose = () => {
    selectedDate.value = null;
    isAddingHealth.visit = false;
    selectVisit(null);
};

const handleSubmit = async () => {
    if (!selectedPet.value) return;
    const titleSnapshot = formData.title;
    try {
        if (isAddingHealth.visit) {
            await addNewVetVisit({ ...formData }, selectedPet.value.id);
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.visitAdded", { name: selectedPet.value.name, title: titleSnapshot }),
            });
        }
        else if (selectedVisit.value && !shallowEqual(formData,
            { ...selectedVisit.value, date: tsToDate(selectedVisit.value.date, "input") })) {
            await updateSelectedVisit(selectedVisit.value, selectedPet.value.id, { ...formData });
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.visitUpdated", { name: selectedPet.value.name, title: titleSnapshot }),
            });
        }
    }
    catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    } finally { resetForm(formData, defaultForm) };
};

const handleDelete = async () => {
    const pet = selectedPet.value;
    const visit = selectedVisit.value;
    if (!visit || !pet) return;
    open({
        title: t("dialog.deleteVetVisit.title", { title: visit.title }),
        message: t("dialog.deleteVetVisit.message", { name: pet.name, title: visit.title }),
        isDelete: true,
        onConfirm: async () => {
            try {
                await deleteSelectedVisit(visit, pet.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.visitDeleted", { name: pet.name, title: visit.title }),
                });
            } catch (error) {
                show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
            }
        }
    });
};

watch(() => isAddingHealth.visit, (adding) => {
    if (adding) {
        mode.value = "edit";
        formData.vet = assignedVet.value;
        formData.date = visitDate.value;
    }
});

watch(() => [selectedPet.value, selectedVisit.value] as const,
    ([pet, visit]) => {
        if (!pet) {
            resetForm(formData, defaultForm);
            return;
        };
        if (visit) {
            mode.value = "view";
            fillVisitData(visit);
        }
        else {
            resetForm(formData, defaultForm, { exclude: ['title'] });
            formData.vet = assignedVet.value;
            formData.date = visitDate.value;
        };
    },
    { immediate: true }
);

watch(() => mode.value, (mode) => {
    if (mode === "view") fillVisitData(selectedVisit.value!);
})
</script>

<template>
    <Transition name="panel" appear>
        <FormWrapper v-if="isAddingHealth.visit || selectedVisit" :onClose="handleClose">
            <LoadingPuppy v-if="healthLoading" />
            <div v-else class="md:max-w-max">
                <div class="flex gap-1 justify-between my-1 default-padding items-center">
                    <div v-if="selectedVisit && selectedPet"
                        class="rounded-full w-3 h-3 bg-brand-rgba text-3xl flex shrink-0 justify-center items-center">
                        {{ getIcon(selectedPet) }}
                    </div>
                    <h1 v-if="isAddingHealth.visit">{{ t("health.title.addVetVisit") }}</h1>
                    <h1 v-else-if="selectedVisit && mode === 'edit'">{{ t("health.title.editVetVisit", {
                        name: selectedPet!.name
                    }) }}</h1>
                    <h1 v-else-if="selectedVisit && mode === 'view'">{{ selectedVisit.title }}</h1>
                    <Button v-if="selectedVisit" class="ml-auto mb-auto" variant="ghost" size="xs"
                        :aria-label="t('health.cta.deleteVisit')" @click="handleDelete">
                        <Trash2 :size="22" color="var(--color-brand-light)" />
                    </Button>
                </div>
                <PetSelector v-if="isAddingHealth.visit" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-if="isVisible" v-model="formData.title" :id="title.id" :label="t(title.label)"
                            required />
                        <Input v-if="isVisible" v-model="formData.date" :id="date.id" :label="t(date.label)"
                            :type="date.type" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <div v-else-if="selectedVisit && mode === 'view'">
                            <p>{{ t(date.label) }}</p>
                            <p class="read-only">{{ tsToDate(selectedVisit.date, "date") }}</p>
                        </div>
                        <VetFormSelector v-if="isVisible" :vet="vet" v-model="formData.vet"
                            v-model:vetTextInput="vetTextInput" required />
                        <div v-else-if="selectedVisit && mode === 'view'">
                            <p>{{ t(vet.label) }}</p>
                            <p class="read-only">{{vets?.find(vet => vet.id === selectedVisit!.vet)?.name ??
                                selectedVisit.vet}}</p>
                        </div>
                        <label :for="notes.id" v-if="isVisible">
                            <p>{{ t(notes.label) }}</p>
                            <textarea v-model="formData.notes" :id="notes.id"
                                :readonly="!!selectedVisit && mode === 'view'" />
                        </label>
                        <div v-else-if="selectedVisit?.notes && mode === 'view'">
                            <p>{{ t(notes.label) }}</p>
                            <p class="read-only">{{ selectedVisit.notes }}</p>
                        </div>
                        <div class="flex gap-0.5 mt-1 items-center ml-auto" v-if="!selectedVisit || mode === 'edit'">
                            <Button v-if="selectedVisit && mode === 'edit'" variant="secondary" size="sm" type="button"
                                :disabled="healthLoading" @click="mode = 'view'">
                                {{ t("common.button.cancel") }}
                            </Button>
                            <Button size="sm" :disabled="healthLoading">{{ t("health.cta.saveVisit")
                            }}
                                <Paw class="w-1 -rotate-12" />
                            </Button>
                        </div>
                        <Button v-if="selectedVisit && mode === 'view'" size="sm" class="mt-1 md:ml-auto"
                            @click="mode = 'edit'">
                            {{ t("health.cta.editVetVisit") }}
                        </Button>
                    </div>
                </form>
            </div>
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
</style>