<script setup lang="ts">
import { ClipboardList, Copy, ExternalLink, Globe, Phone, Shield } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useClipboard } from '../../../composables/useClipboard.ts';
import { usePets } from '../composables/usePets';

const { selectedPet } = usePets();
const { t } = useI18n();
const { copyToClipboard, clipboardText } = useClipboard();
</script>

<template>
    <section class="pet-section" v-if="selectedPet?.insurance">
        <h2>{{ t("pet.profile.labels.insurance") }}</h2>
        <div class="card">
            <div class="flex flex-row gap-1 items-center">
                <div class="rounded-xl w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    <Shield />
                </div>
                <div>
                    <h3 v-if="selectedPet.insurance.company">{{ selectedPet.insurance.company }}</h3>
                    <span v-if="selectedPet.insurance.policy"
                        class="text-brand-light text-xs flex items-center gap-0.25 mt-0.25">
                        <ClipboardList :size="18" /> {{ selectedPet.insurance.policy }}
                        <Button size="xxs" variant="ghost" :aria-label="t('pet.profile.edit.microchip')"
                            @click="copyToClipboard(selectedPet.insurance.policy)" class="p-[6px]">
                            <Copy v-if="!clipboardText" :size="15" />
                            <span v-if="clipboardText">{{ clipboardText }}</span>
                        </Button>
                    </span>
                </div>
            </div>
            <div class="flex flex-row gap-0.5 text-sm"
                v-if="selectedPet.insurance.contact || selectedPet.insurance.web">
                <div v-if="selectedPet.insurance.contact" class="rounded-xl bg-separator p-0.75 flex-1">
                    <h4>
                        <Phone :size="12" /> {{ t("pet.insurance.contact") }}
                    </h4>
                    <a :href="`tel:${selectedPet.insurance.contact.replace(/\s/g, '')}`" target="_blank">
                        {{ selectedPet.insurance.contact }}
                    </a>
                </div>
                <div v-if="selectedPet.insurance.web" class="rounded-xl bg-separator p-0.75 flex-1 truncate">
                    <h4>
                        <Globe :size="12" />
                        {{ t("pet.insurance.web") }}
                    </h4>
                    <a :href="selectedPet.insurance.web" target="_blank" class="flex gap-0.5 text-xs items-center">
                        <span class="truncate">{{ selectedPet.insurance.web?.split('//')[1] }}</span>
                        <ExternalLink :size="15" class="shrink-0" />
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
h4 {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    text-transform: uppercase;
    font-size: smaller;
    color: var(--color-text-secondary);
    font-weight: 500;
    letter-spacing: 1px;
    padding-bottom: 10px;
}
</style>