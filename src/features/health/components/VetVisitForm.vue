<script setup lang="ts">
import { CalendarCheck, Trash2 } from '@lucide/vue';
import { nextTick, reactive, ref, Transition, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import FormWrapper from '../../../components/FormWrapper.vue';
import Paw from '../../../components/icons/Paw.vue';
import Input from '../../../components/Input.vue';
import LoadingPuppy from '../../../components/loading/LoadingPuppy.vue';
import { useDialog } from '../../../composables/useDialog';
import { useToast } from '../../../composables/useToast';
import { shallowEqual, tsToDate } from '../../../utils';
import PetSelector from '../../pets/components/PetSelector.vue';
import { usePets } from '../../pets/composables/usePet';
import { getIcon } from '../../pets/utils';
import { vetVisitFields } from '../config';
import VetFormSelector from './VetFormSelector.vue';

const { selectedPet, selectedVisit, selectVisit, isAddingHealth, healthLoading, addNewVetVisit, updateSelectedVisit, deleteSelectedVisit, healthError, selectedDate, selectedVet, vets } = usePets();
const { show } = useToast();
const { open } = useDialog();
const { t } = useI18n();

const { title, date, vet, notes } = vetVisitFields;
const vetTextInput = ref<boolean>(false);
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
        else if (selectedVisit.value && !shallowEqual(formData, selectedVisit.value)) {
            await updateSelectedVisit(selectedVisit.value, selectedPet.value.id, { ...formData });
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.visitUpdated", { name: selectedPet.value.name, title: titleSnapshot }),
            });
        }
    }
    catch (e) {
        show({ type: "error", title: "Error", message: healthError.value || "" });
    };
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
            } catch (error) { console.log(error) }
        }
    });
};

watch(() => [isAddingHealth.visit],
    ([adding]) => {
        if (adding) {
            nextTick(() => {
                if (selectedDate.value) formData.date = selectedDate.value;
                if (selectedVet.value) formData.vet = selectedVet.value.id;
                if (vets.value && !selectedVet.value) formData.vet = vets.value[0].id;
            });
        }
    }
);

watch(() => [selectedPet.value, selectedVisit.value] as const,
    ([pet, visit]) => {
        if (!pet) {
            resetForm();
            return;
        };
        if (visit) {
            const isRegisteredVet = vets.value?.some(vet => vet.id === visit.vet);
            vetTextInput.value = !isRegisteredVet;
            Object.assign(formData, {
                title: visit.title,
                date: tsToDate(visit.date, "input"),
                vet: visit.vet,
                notes: visit.notes ?? "",
            });
        }
        else {
            resetForm();
            formData.date = selectedDate.value ?? ""
            formData.vet = selectedVet.value
                ? selectedVet.value.id
                : vets.value ? vets.value[0].id : ""
        }
    },
    { immediate: true }
);
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
                    <h1>
                        {{ isAddingHealth.visit
                            ? t("health.title.addVetVisit")
                            : t("health.title.editVetVisit", { name: selectedPet!.name })
                        }}
                    </h1>
                    <Button v-if="selectedVisit" class="ml-auto mb-auto" variant="ghost" size="xs"
                        :aria-label="t('health.cta.deleteVisit')" @click="handleDelete">
                        <Trash2 :size="22" color="var(--color-brand-light)" />
                    </Button>
                </div>
                <PetSelector v-if="isAddingHealth.visit" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-model="formData.title" :id="title.id" :type="title.type" :label="t(title.label)"
                            ref="titleInputRef" required />
                        <Input v-model="formData.date" :id="date.id" :label="t(date.label)" :type="date.type" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <VetFormSelector :vet="vet" v-model="formData.vet" v-model:vetTextInput="vetTextInput"
                            required />
                        <label :for="notes.id">
                            <p>{{ t(notes.label) }}</p>
                            <textarea v-model="formData.notes" :id="notes.id" />
                        </label>
                        <Button size="sm" :disabled="healthLoading" class="md:ml-auto">{{ t("health.cta.saveVisit") }}
                            <Paw class="w-1 -rotate-12" />
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

:deep(label:has(input[type="text"]:not(:required)) p::after),
label:has(textarea) p::after {
    content: "(optional)";
    margin-left: 10px;
    color: var(--color-text-secondary);
    font-size: small;
}
</style>