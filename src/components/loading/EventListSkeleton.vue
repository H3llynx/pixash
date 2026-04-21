<template>
    <section class="animate-pulse w-full md:px-0 pet-section mb-4 md:mb-1">
        <div v-for="_n in 3"
            class="bg-bg-2 border border-border rounded-xl space-y-0.25 p-1 mb-1 w-full md:max-w-md flex justify-between">
            <div>
                <div class="h-1 w-16 rounded bg-grey-light opacity-30 mb-0.5"></div>
                <div class="h-[10px] w-6 rounded bg-grey-light opacity-30"></div>
            </div>
            <div>
                <div class="h-3 w-3 rounded-full bg-grey-light opacity-30 m-auto"></div>
                <div class="h-[6px] w-2.5 mt-0.5 rounded bg-grey-light opacity-30 m-auto"></div>
            </div>
        </div>
    </section>
</template>