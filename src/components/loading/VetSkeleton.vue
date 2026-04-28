<script setup lang="ts">
import { useMedia } from '../../composables/useMedia';

const { isMd } = useMedia();
</script>

<template>
    <div class="animate-pulse flex flex-col gap-1.5 default-padding py-1 max-w-full overflow-hidden">
        <div class="h-[10px] w-7 rounded bg-grey-light opacity-30"></div>
        <div class="flex gap-1 w-full">
            <div v-for="i in isMd ? 2 : 1" :key="i"
                class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-full md:w-sm shrink-0">
                <div class="flex items-center relative">
                    <div class="rounded-xl w-4 aspect-square bg-grey-light opacity-30 min-w-2"></div>
                    <div class="p-1 flex flex-col gap-0.5 w-full">
                        <div class="h-1 w-1/2 rounded bg-grey-light opacity-30"></div>
                        <div class="h-[10px] w-2/3 rounded bg-grey-light opacity-20"></div>
                    </div>
                    <div class="h-1 w-1 rounded bg-grey-light opacity-20 absolute right-0 top-0 shrink-0">
                    </div>
                </div>
                <div class="flex gap-0.5 mt-0.5">
                    <div class="h-1 w-3 rounded-full bg-grey-light opacity-30"></div>
                    <div class="h-1 w-3 rounded-full bg-grey-light opacity-20"></div>
                </div>
                <div class="flex flex-col gap-0.75 mt-0.5">
                    <div class="h-1 w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-1 w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-1 w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-2 w-full rounded-xl bg-grey-light opacity-20 mt-1"></div>
                    <div class="h-3 w-full rounded-xl bg-grey-light opacity-20"></div>
                    <div class="h-px w-full rounded bg-grey-light opacity-20"></div>
                </div>
                <div class="flex gap-0.75 mt-0.5">
                    <div v-for="i in 3" :key=i class="h-2.75 flex-1 rounded-xl bg-grey-light opacity-30 shrink-0">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>