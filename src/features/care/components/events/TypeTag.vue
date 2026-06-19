<script setup lang="ts">
import type { PetEvent } from '../../types';

const props = defineProps<{ event: PetEvent }>();

const getTagStyle = () => {
    return {
        "tag capitalize": true,
        "vaccine": props.event.eventType === "vaccine",
        "visit": props.event.eventType === "visit",
        "antiparasite": props.event.type === "antiparasite",
        "weight": props.event.type === "weight",
    };
};
</script>

<template>
    <span v-if="event.eventType !== 'log'" :class="getTagStyle()">{{ event.eventType }}</span>
    <span v-else :class="getTagStyle()">{{ event.type }}</span>
</template>

<style scoped>
.weight {
    background: rgba(79, 147, 190, 0.2);
    color: rgb(93, 144, 175);
}

.visit {
    background: rgba(50, 126, 70, 0.2);
    color: rgb(57, 159, 84);
}

.antiparasite {
    background: rgba(190, 179, 79, 0.2);
    color: rgb(190, 179, 79);
}

.vaccine {
    background: rgba(226, 75, 74, 0.2);
    color: rgb(231, 76, 76);
}
</style>