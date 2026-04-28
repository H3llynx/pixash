<script setup lang="ts">
import { useMedia } from '../../composables/useMedia';

const { isMd } = useMedia();
</script>

<template>
    <div class="animate-pulse flex flex-col gap-1.5 default-padding py-1 max-w-full overflow-hidden">

        <!-- Pet switcher chips -->
        <div class="flex gap-0.5 md:hidden">
            <div class="h-2 w-5 rounded-full bg-grey-light opacity-30"></div>
            <div class="h-2 w-5 rounded-full bg-grey-light opacity-20"></div>
        </div>

        <!-- Stat row -->
        <div class="grid grid-cols-2 gap-1 md:max-w-xl md:h-6">
            <div v-for="i in 2" :key="i" class="bg-bg-2 border border-border rounded-xl p-0.75 flex flex-col gap-0.25">
                <div class="h-[10px] w-3/4 rounded bg-grey-light opacity-30"></div>
                <div class="h-1 w-1/2 rounded bg-grey-light opacity-30"></div>
                <div class="h-[10px] w-5/6 rounded bg-grey-light opacity-20"></div>
            </div>
        </div>

        <!-- Pet profile card -->
        <div>
            <div class="h-[10px] w-7 rounded bg-grey-light opacity-30 mb-0.75"></div>
            <div class="flex gap-1 w-full">
                <div v-for="i in isMd ? 2 : 1" :key="i"
                    class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-full md:w-sm shrink-0">
                    <div class="flex items-center relative">
                        <div class="rounded-full w-4 aspect-square bg-grey-light opacity-30 min-w-2"></div>
                        <div class="p-1 flex flex-col gap-0.5 w-full">
                            <div class="h-1 w-1/2 rounded bg-grey-light opacity-30"></div>
                            <div class="h-[10px] w-2/3 rounded bg-grey-light opacity-20"></div>
                        </div>
                        <div class="h-1.25 w-1.25 rounded bg-grey-light opacity-20 absolute right-0 top-0 shrink-0">
                        </div>
                    </div>
                    <div class="flex flex-col gap-0.75 mt-1">
                        <div class="h-1 w-full rounded bg-grey-light opacity-20"></div>
                        <div class="h-1 w-full rounded bg-grey-light opacity-20"></div>
                        <div class="h-1 w-full rounded bg-grey-light opacity-20"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Upcoming events -->
        <div>
            <div class="h-[10px] w-7 rounded bg-grey-light opacity-30 mb-0.75"></div>
            <EventCardSkeleton v-for="i in 2" :key="i" />
        </div>
    </div>
</template>