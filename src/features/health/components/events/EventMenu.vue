<script setup lang="ts">
import { BugOff, ChevronLeft, ChevronUp, NotebookPen, Stethoscope, Syringe } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FormWrapper from '../../../../components/FormWrapper.vue';
import { useMedia } from '../../../../composables/useMedia';
import { resetState } from '../../../../utils';
import { usePets } from '../../../pets/composables/usePets';
import { useEvents } from '../../composables/useEvents';

const { isAddingHealth, selectedLog, selectVaccine, selectVisit } = usePets();
const { selectedDate } = useEvents();
const { t, locale } = useI18n();
const { isMd } = useMedia();

const visible = defineModel<boolean>("visible")
const submenu = ref<boolean>(false);
const menuRef = ref<HTMLDivElement>();

onClickOutside(menuRef, () => {
    if (visible.value) visible.value = false;
    submenu.value = false;
});

const handleClick = (action: string) => {
    resetState(isAddingHealth);
    resetState(selectedLog);
    selectVaccine(null);
    selectVisit(null);
    if (action === "vaccine") isAddingHealth.vaccine = true;
    else if (action === "visit") isAddingHealth.visit = true;
    else if (action === "antiparasitic") isAddingHealth.antiparasitic = true;
    visible.value = false;
}

const handleClose = () => {
    visible.value = false;
    submenu.value = false;
    selectedDate.value = null;
}

watch(() => visible.value, (visible) => {
    if (visible) {
        resetState(isAddingHealth);
        resetState(selectedLog);
        selectVaccine(null);
        selectVisit(null);
    }
});
</script>

<template>
    <Transition name="toast" v-if="isMd">
        <div v-if="visible" ref="menuRef" role="menu" class="absolute -translate-x-1/2 w-max ">
            <div v-if="!submenu" class="flex gap-[3px] flex-col">
                <Button variant="ghost" size="xxs" @click="handleClick('vaccine')" :aria-label="t('addMenu.vaccine')">
                    <span>{{ t("addMenu.vaccine") }}</span>
                    <Syringe :size="18" />
                </Button>
                <Button variant="ghost" size="xxs" @click="handleClick('visit')" :aria-label="t('addMenu.vetVisit')">
                    <span>{{ t("addMenu.vetVisit") }}</span>
                    <Stethoscope :size="18" />
                </Button>
                <Button variant="ghost" size="xxs" @click="submenu = true" :aria-label="t('addMenu.antiparasitic')">
                    <span>{{ t("addMenu.log") }}</span>
                    <NotebookPen :size="isMd ? 18 : 20" />
                </Button>
            </div>
            <div v-else class="flex gap-[3px] flex-col">
                <Button variant="ghost" size="xs" class="no-border mx-auto" @click="submenu = false" v-if="submenu"
                    :aria-label="t('common.button.back')">
                    <ChevronUp />
                </Button>
                <Button variant="ghost" size="xxs" @click="handleClick('antiparasitic')"
                    :aria-label="t('addMenu.antiparasitic')">
                    <span>{{ t("addMenu.antiparasitic") }}</span>
                    <BugOff :size="18" />
                </Button>
            </div>
        </div>
    </Transition>

    <Transition name="panel" v-else>
        <FormWrapper :onClose="handleClose" v-if="visible" class="bg-bg-rgba filter-blur">
            <div class="flex default-padding my-1 gap-1 items-center">
                <Button variant="ghost" size="xs" class="no-border" @click="submenu = false" v-if="submenu"
                    :aria-label="t('common.button.back')">
                    <ChevronLeft />
                </Button>
                <h2 v-if="selectedDate">{{ new Date(selectedDate).toLocaleDateString(locale, {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }) }}</h2>
            </div>
            <div v-if="!submenu" class="flex flex-col gap-1 p-1">
                <Button variant="secondary" size="sm" @click="handleClick('vaccine')"
                    :aria-label="t('addMenu.vaccine')">
                    <div class="rounded-xl w-3 h-3 bg-brand-light flex shrink-0 justify-center items-center">
                        <Syringe :size="20" />
                    </div>
                    <span>{{ t("addMenu.vaccine") }}</span>
                </Button>
                <Button variant="secondary" size="sm" @click="handleClick('visit')" :aria-label="t('addMenu.vetVisit')">
                    <div class="rounded-xl w-3 h-3 bg-brand-light flex shrink-0 justify-center items-center">
                        <Stethoscope :size="20" />
                    </div>
                    <span>{{ t("addMenu.vetVisit") }}</span>
                </Button>
                <Button variant="secondary" size="sm" @click="submenu = true" :aria-label="t('addMenu.antiparasitic')">
                    <div class="rounded-xl w-3 h-3 bg-brand-light flex shrink-0 justify-center items-center">
                        <NotebookPen :size="20" />
                    </div>
                    <span>{{ t("addMenu.log") }}</span>
                </Button>
            </div>
            <div v-else class="flex flex-col gap-1 p-1">
                <Button variant="secondary" size="sm" @click="handleClick('antiparasitic')"
                    :aria-label="t('addMenu.antiparasitic')">
                    <div class="rounded-xl w-3 h-3 bg-brand-light flex shrink-0 justify-center items-center">
                        <BugOff :size="20" />
                    </div>
                    <span>{{ t("addMenu.antiparasitic") }}</span>
                </Button>
            </div>
        </FormWrapper>
    </Transition>
</template>

<style scoped>
button {
    justify-content: space-between;
    border: 1px solid var(--color-border);

    &:hover {
        background: var(--color-brand-rgba)
    }
}

.no-border {
    border-color: transparent;
}

@media (width < 48rem) {
    button {
        justify-content: flex-start;
        gap: 1rem;
        border-radius: 0.75rem;
        color: var(--color-text);
    }
}
</style>