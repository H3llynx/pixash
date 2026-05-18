<template>
    <div
        class="animate-pulse flex-1 flex flex-col gap-1.5 pb-6.5 md:pl-18 md:pb-0 mt-1 md:mt-0 lg:gap-0 lg:grid lg:grid-cols-[55%_45%] xl:grid-cols-[65%_1fr]">
        <div class="p-0 md:py-1.5 default-padding flex flex-col gap-1.5">
            <div class="h-1 w-7 rounded bg-grey-light opacity-30"></div>
            <div class="flex gap-1 w-full">
                <div
                    class="flex flex-col gap-0.5 px-1 pt-2 pb-1 rounded-xl border border-border bg-bg-2 w-full md:max-w-sm">
                    <div class="flex items-start">
                        <div class="rounded-xl w-5 aspect-square bg-grey-light opacity-30 min-w-2"></div>
                        <div class="px-1 flex flex-col gap-0.5 w-full">
                            <div class="h-1.5 w-1/2 rounded bg-grey-light opacity-30"></div>
                            <div class="h-[10px] w-2/3 rounded bg-grey-light opacity-20"></div>
                            <div class="h-[10px] w-1/2 rounded bg-grey-light opacity-20"></div>
                        </div>
                        <div class="h-1 w-1 rounded bg-grey-light opacity-20 shrink-0">
                        </div>
                    </div>
                    <div class="flex gap-0.5 my-1 items-center">
                        <div class="h-1.5 w-3.25 rounded-full bg-grey-light opacity-30"></div>
                        <div class="h-1.5 w-3.25 rounded-full bg-grey-light opacity-20"></div>
                        <div class="h-1 w-3 rounded-full bg-grey-light opacity-20"></div>
                    </div>
                    <div class="flex flex-col gap-0.75 mt-0.5">
                        <div class="h-1.5 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.5 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.5 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-2.5 w-full rounded-xl bg-grey-light opacity-20 md:hidden mt-1"></div>
                        <div class="h-4 w-full rounded-xl bg-grey-light opacity-10"></div>
                    </div>
                    <div class="h-px mt-1 w-full rounded bg-grey-light opacity-20"></div>
                    <div class="flex gap-0.75 mt-0.5">
                        <div v-for="i in 3" :key=i class="h-3 flex-1 rounded-xl bg-grey-light opacity-30 shrink-0">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="flex flex-col gap-1.5 pb-1 default-padding lg:px-1.5 lg:bg-bg-rgba lg:pt-1.5 lg:border-l lg:border-border lg:h-full">
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