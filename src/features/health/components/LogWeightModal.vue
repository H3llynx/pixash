<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import FreeModal from '../../../components/FreeModal.vue';
import Input from '../../../components/Input.vue';
import LoadingPuppy from '../../../components/loading/LoadingPuppy.vue';
import { usePetDetails } from '../../pets/composables/usePetDetails';
import { usePets } from '../../pets/composables/usePets';
import type { PetExtended } from '../../pets/types';
import type { Log } from '../types';

const { isAddingHealth, addNewLog } = usePets();
const { t } = useI18n();

const props = defineProps<{ pet: PetExtended }>();
const { loading, getWeightInGrams, formPartialUpdate } = usePetDetails(props.pet);

const handleSubmit = async () => {
    if (!formPartialUpdate.data) return;
    loading.value = true;
    const grams = getWeightInGrams();
    if (grams === null) return;
    const log: Log = {
        type: "weight",
        weight: grams,
    };
    await addNewLog(log, props.pet.id);
    loading.value = false;
    isAddingHealth.weight = false;
};
</script>

<template>
    <FreeModal v-model="isAddingHealth.weight">
        <Transition name="toast">
            <div class="dialog-box" v-show="isAddingHealth.weight">
                <LoadingPuppy v-if="loading" class="max-w-xs" />
                <form v-else class="flex flex-col gap-1 mini-form" @submit.prevent="handleSubmit">
                    <h2>{{ t('pet.profile.edit.weight', { name: pet.name }) }}</h2>
                    <div class="flex gap-0.5">
                        <Input v-model="formPartialUpdate.data" type="number" id="first-weight-log"
                            :step="formPartialUpdate.unit === 'kg' ? '0.001' : '1'" ref="weightInputRef"
                            class="text-base" />
                        <div class="input-container w-max">
                            <select v-model="formPartialUpdate.unit">
                                <option>kg</option>
                                <option>g</option>
                            </select>
                        </div>
                    </div>
                    <Button>{{ t("common.button.confirm") }}</Button>
                    <Button type="button" variant="ghost" @click="isAddingHealth.weight = false">{{
                        t("common.button.cancel")
                        }}</Button>
                </form>
            </div>
        </Transition>
    </FreeModal>
</template>

<style scoped>
select {
    padding: 0.5rem;
    width: 3rem;
}
</style>