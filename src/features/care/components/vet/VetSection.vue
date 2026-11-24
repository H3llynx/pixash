<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Scrollable from '../../../../components/Scrollable.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useAllPetsView } from '../../composables/useAllPetsView.ts';
import VetCard from './VetCard.vue';

const { hasVets, isAddingCare, moveVet } = usePets();
const { filteredVets } = useAllPetsView();
const { t } = useI18n();

const dragFromId = ref<string | null>(null);

const onDrop = (toId: string) => {
    if (dragFromId.value) moveVet(dragFromId.value, toId);
    dragFromId.value = null;
}

const onDragStart = (id: string, event: DragEvent) => {
    dragFromId.value = id;
    const card = event.currentTarget as HTMLElement;
    const ghost = card.cloneNode(true) as HTMLElement;
    ghost.style.position = "fixed";
    ghost.style.top = "-9999px";
    ghost.style.width = `${card.offsetWidth}px`;
    document.body.appendChild(ghost);
    event.dataTransfer?.setDragImage(ghost, event.offsetX, event.offsetY);
    setTimeout(() => ghost.remove());
};


const moveBy = async (index: number, direction: -1 | 1) => {
    const vet = filteredVets.value[index];
    const target = filteredVets.value[index + direction];
    if (!vet || !target) return;
    moveVet(vet.id, target.id);
    await nextTick();
    document.querySelector(`[data-vet="${vet.id}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}
</script>

<template>
    <section class="pet-section p-0">
        <h2 class="default-padding">{{ t("health.title.myVets") }}</h2>
        <Scrollable v-if="hasVets" :list="filteredVets">
            <VetCard v-for="(vet, i) in filteredVets" :key="vet.id" :vet="vet" :data-vet="vet.id" draggable="true"
                @dragstart="onDragStart(vet.id, $event)" @dragover.prevent @drop="onDrop(vet.id)"
                @move="moveBy(i, $event)" :canMoveEarlier="i > 0" :canMoveLater="i < filteredVets.length - 1" />
        </Scrollable>
        <div v-else class="default-padding">
            <Button variant="secondary" @click="isAddingCare.vet = true;">
                <Plus />{{ t("health.title.addVet") }}
            </Button>
        </div>
    </section>
</template>

<style scoped>
:deep(.pet-selector) {
    touch-action: unset;
    scroll-snap-type: x mandatory;
}
</style>