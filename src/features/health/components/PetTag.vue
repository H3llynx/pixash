<script setup lang="ts">
import { SPECIES } from '../../pets/config';
import type { PetExtended } from '../../pets/types';
import { getIcon } from '../../pets/utils';

const props = defineProps<{ pet: PetExtended }>();

const getTagStyle = () => {
    return {
        "flex items-center justify-center gap-[5px] rounded-full py-[5px] px-[10px] text-xs border font-medium": true,
        "orange": props.pet.species === SPECIES[0].id,
        "purple": props.pet.species === SPECIES[1].id,
        "yellow": props.pet.species === SPECIES[2].id,
        "grey": props.pet.species === SPECIES[3].id,
        "blue": props.pet.species === SPECIES[4].id,
        "green": props.pet.species === SPECIES[5].id,
        "pink": props.pet.species === SPECIES[6].id,
    };
};
</script>

<template>
    <div :class="getTagStyle()">
        <span aria-hidden>{{ getIcon(pet) }}</span>
        {{ pet.name }}
    </div>
</template>

<style scoped>
.orange {
    background: rgba(207, 136, 22, 0.2);
    color: rgb(207, 136, 22);
    border-color: rgba(207, 136, 22, 0.15);
}

.purple {
    background: rgba(134, 71, 182, 0.2);
    color: rgb(172, 94, 255);
    border-color: rgba(134, 71, 182, 0.15);
}

.yellow {
    background: rgba(184, 151, 31, 0.2);
    color: rgb(184, 151, 31);
    border-color: rgba(184, 151, 31, 0.15);
}

.grey {
    background: rgba(116, 137, 168, 0.2);
    color: rgb(130, 147, 173);
    border-color: rgba(116, 137, 168, 0.15);
}

.blue {
    background: rgba(86, 186, 210, 0.2);
    color: rgb(51, 167, 196);
    border-color: rgba(86, 186, 210, 0.15);
}

.green {
    background: rgba(92, 164, 110, 0.2);
    color: rgb(92, 164, 110);
    border-color: rgba(92, 164, 110, 0.15);
}

.pink {
    background: rgba(205, 97, 188, 0.2);
    color: rgb(205, 97, 188);
    border-color: rgba(205, 97, 188, 0.15);
}
</style>