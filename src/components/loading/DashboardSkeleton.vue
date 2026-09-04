<script setup lang="ts">
import { useMedia } from '../../composables/useMedia.ts';
import EventCardSkeleton from './EventCardSkeleton.vue';

const { isMd, isLg } = useMedia();
</script>

<template>
    <div class="animate-pulse overflow-hidden flex-1 flex flex-col gap-2 md:pl-5 pb-7.5 md:pb-1 lg:lg-grid">
        <div class="flex flex-col gap-2 default-padding">
            <!-- Selector row -->
            <div class="flex gap-1">
                <div v-for="i in 2" :key="i" class="bg-grey-light opacity-20 rounded-xl w-9 h-8">
                </div>
            </div>

            <!-- Pet profile -->
            <div class="flex flex-col gap-1 w-full">
                <div class="h-1 w-7 rounded bg-grey-light opacity-30"></div>
                <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-full">
                    <div class="flex items-center relative">
                        <div class="rounded-full w-4 aspect-square bg-grey-light opacity-30 min-w-2"></div>
                        <div class="px-1 flex flex-col gap-0.5 w-full">
                            <div class="h-1.5 w-1/3 rounded bg-grey-light opacity-30"></div>
                            <div class="h-[10px] w-1/2 rounded bg-grey-light opacity-20"></div>
                            <div class="h-[10px] w-1/2 rounded bg-grey-light opacity-20"></div>
                        </div>
                        <div class="h-1.25 w-1.25 rounded bg-grey-light opacity-20 absolute right-0 top-0 shrink-0">
                        </div>
                    </div>
                    <div class="h-1.5 w-full rounded-lg bg-grey-light opacity-20 mt-1"></div>
                </div>
                <div v-if="!isMd" class="flex gap-0.5">
                    <div v-for="i in 3" :key="i" class="bg-grey-light opacity-20 rounded-xl w-1/3 h-6">
                    </div>
                </div>
            </div>

            <!-- Weight chart -->
            <div v-if="isLg">
                <div class="h-1 w-7 rounded bg-grey-light opacity-30 mb-1"></div>
                <div class="flex flex-col gap-2.5 px-1 pt-1 rounded-xl border border-border bg-bg-2 w-full">
                    <div class="flex gap-0.5 justify-between">
                        <div class="h-2 w-5 rounded-full bg-grey-light opacity-30"></div>
                        <div class="h-2 w-6 rounded-lg bg-grey-light opacity-20 shrink-0"></div>
                    </div>
                    <div class="flex gap-0.5 justify-between items-end">
                        <div class="w-1/5 h-4 rounded-t-xl bg-grey-light opacity-30"></div>
                        <div class="w-1/5 h-5 rounded-t-xl bg-grey-light opacity-30"></div>
                        <div class="w-1/5 h-5 rounded-t-xl bg-grey-light opacity-30"></div>
                        <div class="w-1/5 h-4.5 rounded-t-xl bg-grey-light opacity-30"></div>
                        <div class="w-1/5 h-5 rounded-t-xl bg-grey-light opacity-30"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="default-padding flex flex-col gap-2 lg:px-1.5">
            <!-- Next due md row -->
            <div v-if="isLg" class="flex gap-1">
                <div v-for="i in 3" :key="i" class="bg-grey-light opacity-20 rounded-xl w-9 h-8">
                </div>
            </div>

            <!-- Upcoming events -->
            <div>
                <div class="h-1 w-7 rounded bg-grey-light opacity-30 flex mb-1"></div>
                <div class="flex flex-col gap-1">
                    <EventCardSkeleton v-for="i in 2" :key="i" />
                </div>
            </div>

            <!-- Active treatment -->
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
                    <div class="flex gap-0.5">
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                    </div>
                    <div class="flex gap-0.5 mt-1">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0"></div>
                    </div>
                    <div class="flex gap-0.5">
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>