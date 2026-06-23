<script setup lang="ts">
import { CalendarCheck, Trash2, X } from '@lucide/vue';
import { provide, reactive, ref, watch } from 'vue';
import VueEasyLightbox, { useEasyLightbox } from 'vue-easy-lightbox';
import { useI18n } from 'vue-i18n';
import AddPictures from '../../../../components/AddPictures.vue';
import Button from '../../../../components/Button.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Panel from '../../../../components/Panel.vue';
import Selector from '../../../../components/Selector.vue';
import Textarea from '../../../../components/Textarea.vue';
import { useAddPictures } from '../../../../composables/useAddPictures.ts';
import { useDialog } from '../../../../composables/useDialog.ts';
import { useFormMode } from '../../../../composables/useFormMode.ts';
import { useToast } from '../../../../composables/useToast.ts';
import { hostImg } from '../../../../services/img-hosting.ts';
import { shallowEqual, tsToDate } from '../../../../utils.ts';
import PetIcon from '../../../pets/components/PetIcon.vue';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { logFields } from '../../../pets/config.ts';
import { useEvents } from '../../composables/useEvents.ts';
import type { Log, OtherLogExtended } from '../../types.ts';
import { resetForm } from '../../utils.ts';

const { selectedPet, deleteSelectedLog, healthError, isAddingCare, selectedLog, addNewLog, updateSelectedLog } = usePets();
const { selectedDate } = useEvents();
const { t } = useI18n();
const { show } = useToast();
const { open } = useDialog();
const { mode, isReadonly } = useFormMode();
const { pictures } = useAddPictures();
provide('readonly', isReadonly);

const { subtype, date, notes } = logFields;
const loading = ref<boolean>(false);
const error = ref<boolean>(false);
const defaultForm = {
    subtype: subtype.options[0].id,
    date: "",
    pictures: [] as string[],
    notes: ""
};
const formData = reactive({ ...defaultForm });

const { show: showLightbox, onHide, visibleRef, indexRef, imgsRef } = useEasyLightbox({
    imgs: formData.pictures,
    initIndex: 0
})

const fillLogData = (log: OtherLogExtended) => {
    Object.assign(formData, {
        subtype: log.subtype,
        date: tsToDate(log.date, "input"),
        pictures: log.pictures,
        notes: log.notes ?? "",
    })
};

const handleClose = () => {
    error.value = false;
    selectedDate.value = null;
    isAddingCare.other = false;
    selectedLog.other = null;
    pictures.value = [];
    resetForm(formData, defaultForm);
};

const hostPictures = async () => {
    for (const picture of pictures.value) {
        try {
            const url = await hostImg(picture.file);
            formData.pictures.push(url);
            pictures.value = pictures.value.filter(p => p !== picture);

        } catch (error) {
            console.error(error);
            show({ type: "error", title: t("toast.error.genericTitle"), message: t("toast.error.errorPicture") });
        }
    };
};

const deletePicture = async (picture: string) => {
    formData.pictures = formData.pictures.filter(p => p !== picture);
};

const handleSubmit = async () => {
    if (!selectedPet.value) return;
    loading.value = true;
    try {
        if (pictures.value.length) await hostPictures();
        const log: Log = { ...formData, type: "other" };
        if (isAddingCare.other) {
            await addNewLog(log, selectedPet.value.id);
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.logAdded", { name: selectedPet.value.name, subtype: t(`pet.logs.${formData.subtype}`) }),
            });
            resetForm(formData, defaultForm);
            isAddingCare.other = false;
            pictures.value = [];
        }
        else if (selectedLog.other) {
            const originalData = {
                ...selectedLog.other,
                date: tsToDate(selectedLog.other.date, "input"),
                notes: selectedLog.other.notes ?? "",
            };
            if (!shallowEqual(formData, originalData)) {
                await updateSelectedLog(selectedLog.other, selectedPet.value.id, log);
                pictures.value = [];
            };
        };
    }
    catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    }
    finally { loading.value = false; }
};

const handleDelete = () => {
    const pet = selectedPet.value;
    const log = selectedLog.other;
    if (!log || !pet) return;
    open({
        title: t("dialog.deleteLog.title", { subtype: t(`pet.logs.${selectedLog.other!.subtype}`) }),
        message: t("dialog.deleteLog.message"),
        isDelete: true,
        onConfirm: async () => {
            try {
                loading.value = true;
                await deleteSelectedLog(log, pet.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.logDeleted"),
                });
            } catch (error) {
                show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
            } finally { loading.value = false; }
        }
    });
};

watch(() => isAddingCare.other, (adding) => {
    if (adding) {
        mode.value = "edit";
        Object.assign(formData, { date: selectedDate.value ?? "" });
    };
});

watch(() => selectedLog.other, (log) => {
    mode.value = log ? "view" : "edit";
    if (log) fillLogData(selectedLog.other!);
}, { deep: true });

watch(() => mode.value, () => {
    if (mode.value === 'view' && selectedLog.other?.pictures?.length) {
        Object.assign(formData, { pictures: [...selectedLog.other.pictures] });
        pictures.value = [];
    };
});

watch(() => formData.pictures, (pictures) => {
    imgsRef.value = pictures;
});
</script>

<template>
    <Transition name="panel">
        <Panel v-if="isAddingCare.other || selectedLog.other" :onClose="handleClose">
            <LoadingPuppy v-if="loading" />
            <div class="md:max-w-max" v-else>
                <div class="flex gap-1 justify-between my-1 default-padding">
                    <div v-if="selectedLog.other && selectedPet"
                        class="rounded-full w-3 h-3 bg-brand-rgba text-3xl flex shrink-0 justify-center items-center">
                        <PetIcon :pet="selectedPet" />
                    </div>
                    <h1 v-if="mode === 'edit'">{{ t("pet.title.log") }}</h1>
                    <h1 v-else class="font-medium">{{ selectedPet!.name }} · {{ t("pet.title.otherLog", {
                        subtype:
                            t(`pet.logs.${selectedLog.other!.subtype}`)
                    })
                        }}
                    </h1>
                    <div class="ml-auto mb-auto flex gap-0.5">
                        <Button v-if="selectedLog.other" variant="ghost" size="xs"
                            :aria-label="t('pet.cta.deleteLog', { subtype: t(`pet.logs.${selectedLog.other!.subtype}`) })"
                            @click="handleDelete">
                            <Trash2 :size="22" color="var(--color-brand-light)" />
                        </Button>
                    </div>
                </div>
                <PetSelector v-if="isAddingCare.other" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <Selector v-if="mode === 'edit'" :legend="t(subtype.label)" class="mb-0.5">
                        <Input v-model="formData.subtype" v-for="option in subtype.options" :id="option.id"
                            :value="option.id" :key="option.id" :label="t(option.label)" :type="subtype.type" />
                    </Selector>
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-model="formData.date" :id="date.id" :label="t(date.label)" :type="date.type"
                            :class="mode === 'view'" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <div class="preview-container">
                            <div v-if="formData.pictures.length" v-for="(picture, index) in formData.pictures"
                                class="relative rounded-lg mb-0.25 min-w-[160px] cursor-pointer">
                                <img :src="picture" class="rounded-lg relative" @click="showLightbox(index)" />
                                <Button v-if="mode === 'edit'" type="button" variant="ghost" size="xxs"
                                    :aria-label="t('health.cta.cancelLog')" @click.stop="deletePicture(picture)"
                                    class="delete-btn hover:bg-error">
                                    <X :size="20" />
                                </Button>
                            </div>
                            <AddPictures v-if="mode === 'edit'" />
                        </div>
                        <VueEasyLightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" :loop="true"
                            @hide="onHide" />
                        <label :for="notes.id" v-if="selectedLog.other?.notes || mode === 'edit'">
                            <p>{{ t(notes.label) }}</p>
                            <Textarea v-model="formData.notes" :id="notes.id"
                                :readonly="!!selectedLog.other && mode === 'view'" :placeholder="t(notes.placeholder)"
                                :maxLength="500" />
                        </label>
                        <div class="flex gap-0.5 mt-1 items-center ml-auto"
                            v-if="!selectedLog.other || mode === 'edit'">
                            <Button type="button" v-if="selectedLog.other && mode === 'edit'" variant="secondary"
                                size="sm" :disabled="loading" @click="mode = 'view'">
                                {{ t("common.button.cancel") }}
                            </Button>
                            <Button size="sm" :disabled="loading">{{ t("pet.cta.saveLog", {
                                subtype:
                                    t(`pet.logs.${formData.subtype}`).toLowerCase()
                            })
                                }}</Button>
                        </div>
                        <Button v-if="selectedLog.other && mode === 'view'" size="sm" class="mt-1 md:ml-auto"
                            @click="mode = 'edit'">
                            {{ t("common.button.edit") }}
                        </Button>
                    </div>
                </form>
            </div>
        </Panel>
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