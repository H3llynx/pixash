<script setup lang="ts">
import { useMedia } from '../../composables/useMedia';

const { is2xl, isXl } = useMedia();
</script>

<template>
    <div class="animate-pulse flex-1 flex flex-col gap-2 pb-7.5 md:pl-5 md:pb-0 mt-1 md:mt-0 lg:lg-grid xl:xl-grid">
        <div class="md:py-1.5 default-padding flex flex-col gap-2">
            <!-- Pet selector -->
            <div class="flex gap-1">
                <div v-for="i in 2" :key="i" class="flex flex-col gap-1 items-center justify-center">
                    <div class="h-4 w-4 rounded-full bg-grey-light opacity-30"></div>
                    <div class="h-0.5 w-3 rounded-full bg-grey-light opacity-30"></div>
                </div>
            </div>

            <!-- Event type switcher chips -->
            <div class="flex gap-0.5">
                <div class="h-1.5 w-5 rounded-full bg-grey-light opacity-30"></div>
                <div class="h-1.5 w-6 rounded-full bg-grey-light opacity-20"></div>
                <div class="h-1.5 w-8 rounded-full bg-grey-light opacity-30"></div>
                <div class="h-1.5 w-10 rounded-full bg-grey-light opacity-20"></div>
                <div class="h-1.5 w-6 rounded-full bg-grey-light opacity-30"></div>
            </div>

            <!-- Passed events -->
            <div class="flex flex-col gap-1 xl:grid xl:grid-cols-2">
                <div v-for="i in is2xl ? 8 : isXl ? 6 : 4" :key="i"
                    class="animate-pulse bg-bg-2 border border-border rounded-xl space-y-0.25 p-1 w-full h-6 xl:h-8 flex justify-between">
                    <div class="w-full">
                        <div class="h-1 w-2/3 rounded bg-grey-light opacity-30 mb-0.5"></div>
                        <div class="h-[10px] w-1/3 rounded bg-grey-light opacity-30"></div>
                    </div>
                    <div>
                        <div class="h-[10px] w-2.5 rounded-full bg-grey-light opacity-30 ml-auto"></div>
                        <div class="h-[4px] w-3.5 mt-0.5 rounded bg-grey-light opacity-30 ml-auto"></div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="flex flex-col gap-2 pb-1 default-padding lg:px-1.5 lg:bg-bg-rgba lg:pt-1.5 lg:border-l lg:border-border lg:h-full">
            <!-- Past treatments -->
            <div class="flex flex-col gap-1 w-full">
                <div class="h-1 w-7 rounded bg-grey-light opacity-30"></div>
                <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-full">
                    <div class="flex items-center justify-between">
                        <div class="h-1.25 w-1/3 rounded bg-grey-light opacity-20 shrink-0">
                        </div>
                        <div class="h-1.25 w-1.25 rounded bg-grey-light opacity-20 shrink-0">
                        </div>
                    </div>
                    <div class="h-[10px] w-1/2 rounded bg-grey-light opacity-20"></div>
                    <div class="flex gap-0.5 mt-1">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0">
                        </div>
                    </div>
                    <div class="flex gap-0.5 mt-0.5">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0"></div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-1 w-full">
                <div class="h-1 w-7 rounded bg-grey-light opacity-30"></div>
                <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-full">
                    <div class="flex items-center justify-between">
                        <div class="h-1.25 w-1/3 rounded bg-grey-light opacity-20 shrink-0">
                        </div>
                        <div class="h-1.25 w-1.25 rounded bg-grey-light opacity-20 shrink-0">
                        </div>
                    </div>
                    <div class="h-[10px] w-1/2 rounded bg-grey-light opacity-20"></div>
                    <div class="flex gap-0.5 mt-1">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0">
                        </div>
                    </div>
                    <div class="flex gap-0.5 mt-0.5">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>