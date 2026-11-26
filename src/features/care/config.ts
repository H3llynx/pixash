export const VACCINE_TYPES = {
    dog: [
        { id: "rabies", label: "health.vaccines.types.rabies" },
        { id: "core-combo", label: "health.vaccines.types.dog.combo" },
        { id: "leish", label: "health.vaccines.types.dog.leish" },
    ],
    cat: [
        { id: "rabies", label: "health.vaccines.types.rabies" },
        { id: "core-combo", label: "health.vaccines.types.cat.combo" },
        { id: "felv", label: "health.vaccines.types.cat.felv" },
        { id: "fiv", label: "health.vaccines.types.cat.fiv" },
    ],
    smallMammal: [
        { id: "rabbit-myxorhd", label: "health.vaccines.types.smallMammal.myxo" },
        { id: "rabies", label: "health.vaccines.types.rabies" },
        { id: "ferret-distemper", label: "health.vaccines.types.smallMammal.distemper" },
    ],
    default: [
        { id: "other", label: "health.vaccines.types.other" },
    ],
} as const;

export const PARASITES = {
    worms: { id: "worms", label: "health.antiparasitics.types.worms" },
    fleas: { id: "fleas", label: "health.antiparasitics.types.fleas" },
    lice: { id: "lice", label: "health.antiparasitics.types.lice" },
    ticks: { id: "ticks", label: "health.antiparasitics.types.ticks" },
    heartworm: { id: "heartworm", label: "health.antiparasitics.types.heartworms" },
    mites: { id: "mites", label: "health.antiparasitics.types.mites" },
    protozoa: { id: "protozoa", label: "health.antiparasitics.types.protozoa" },
    other: { id: "other", label: "health.antiparasitics.types.other" }
};
export const ANTIPARASITE_TYPES = {
    dog: [PARASITES.worms, PARASITES.fleas, PARASITES.ticks, PARASITES.heartworm],
    cat: [PARASITES.worms, PARASITES.fleas, PARASITES.ticks],
    smallMammal: [PARASITES.worms, PARASITES.fleas, PARASITES.mites, PARASITES.lice],
    bird: [PARASITES.worms],
    reptile: [PARASITES.worms, PARASITES.protozoa],
    amphibian: [PARASITES.worms],
    fish: [],
    default: [PARASITES.other],
} as const;

export const STAGE = [{ id: "young", label: "health.vaccines.stage.young" }, { id: "adult", label: "health.vaccines.stage.adult" }] as const;

export const VET_TYPES = [{ id: "primary", label: "health.vet.types.primary" }, { id: "secondary", label: "health.vet.types.secondary" }, { id: "emergency", label: "health.vet.types.emergency" }];

export const EVENT_TYPES = [{ id: "vaccine", label: "events.vaccines" }, { id: "visit", label: "events.visits" }, { id: "weight", label: "events.weightLog" }, { id: "antiparasite", label: "events.antiparasitics" }, { id: "other", label: "events.other" }];

export const DUE_DATE_OPTIONS = {
    antiparasitics: [{ id: "month", label: "health.nextDueModal.dateOptions.month" }, { id: "month2", label: "health.nextDueModal.dateOptions.month2" }, { id: "month3", label: "health.nextDueModal.dateOptions.month3" }],
    vaccines: [{ id: "month", label: "health.nextDueModal.dateOptions.month" }, { id: "month6", label: "health.nextDueModal.dateOptions.month6" }, { id: "year", label: "health.nextDueModal.dateOptions.year" }],
};

export const LOG_SUBTYPES = [
    { id: "feeding", label: "pet.logs.feeding", icon: "🍽️" },
    { id: "water", label: "pet.logs.water", icon: "💧" },
    { id: "cleaning", label: "pet.logs.cleaning", icon: "🚿" },
    { id: "behavior", label: "pet.logs.behavior", icon: "🧠" },
    { id: "activity", label: "pet.logs.activity", icon: "⚡️" },
    { id: "grooming", label: "pet.logs.grooming", icon: "✂️" },
    { id: "reproduction", label: "pet.logs.reproduction", icon: "🧬" },
    { id: "other", label: "pet.logs.other", icon: "📝" },
] as const;

export const MED_FREQUENCY = [
    {
        id: "daily",
        label: "health.treatment.form.medicine.frequency.daily",
        dailyDose: 1,
        intervalHours: 24,
    },
    {
        id: "twice_daily",
        label: "health.treatment.form.medicine.frequency.twiceDaily",
        dailyDose: 2,
        intervalHours: 10,

    },
    {
        id: "three_times_daily",
        label: "health.treatment.form.medicine.frequency.threeDaily",
        dailyDose: 3,
        intervalHours: 6,
    },
    {
        id: "every_48_hours",
        label: "health.treatment.form.medicine.frequency.every48",
        intervalHours: 48,
    },
    {
        id: "custom",
        label: "health.treatment.form.medicine.frequency.custom",
    }
];

export const TREATMENTCOLORS = [
    { rgb: "rgb(45, 194, 142)", rgba: "rgba(45, 194, 142, 0.06)" },
    { rgb: "rgb(207, 136, 22)", rgba: "rgba(207, 136, 22, 0.1)" },
    { rgb: "rgb(226, 75, 74)", rgba: "rgba(226, 75, 74, 0.1)" },
    { rgb: "rgb(93, 144, 175)", rgba: "rgba(93, 144, 175, 0.1)" },
    { rgb: "rgb(92, 164, 110)", rgba: "rgba(92, 164, 110, 0.1)" }
];

export const LUMP_STATUS = [
    { id: "monitoring", label: "health.lumps.form.status.monitoring", rgb: "rgb(207, 167, 22)", rgba: "rgba(207, 167, 22, 0.15)" },
    { id: "checked", label: "health.lumps.form.status.checked", rgb: "var(--color-text-softer)", rgba: "rgba(176, 204, 214, 0.5)" },
    { id: "pending", label: "health.lumps.form.status.pending", rgb: "rgb(172, 94, 255)", rgba: "rgba(134, 71, 182, 0.15)" },
    { id: "removed", label: "health.lumps.form.status.removed", rgb: "rgb(47, 187, 138)", rgba: "rgba(47, 187, 138, 0.1)" },
] as const;

export const LUMP_RESULT = [
    { id: "benign", rgb: "rgb(47, 187, 138)", rgba: "rgba(47, 187, 138, 0.1)" },
    { id: "malignant", rgb: "rgb(226, 75, 74)", rgba: "rgba(163, 45, 45, 0.15)" },
    { id: "inconclusive", rgb: "rgb(207, 167, 22)", rgba: "rgba(207, 167, 22, 0.15)" }
]

const vetFields = {
    label: "health.vet.visitForm.vet",
    placeholder: "health.vet.visitForm.placeholderVet"
};

export const medFields = {
    title: "health.treatment.form.medicine.title",
    name: {
        label: "health.treatment.form.medicine.name",
        type: "text",
    },
    instructions: {
        label: "health.treatment.form.medicine.instructions",
        type: "text",
    },
    frequency: {
        name: "medication-frequency",
        label: "health.treatment.form.medicine.frequency.label",
        type: "radio",
        options: MED_FREQUENCY
    },
    noEnd: {
        id: "treatment-end-date",
        label: "health.treatment.form.medicine.noEnd"
    },
    endDate: {
        label: "health.treatment.form.medicine.endDate",
        type: "date"
    },
};

export const antiparasiteFields = {
    treated: {
        label: "health.antiparasitics.form.treated",
        type: "checkbox",
        options: ANTIPARASITE_TYPES,
    },
    notGiven: {
        id: "vaccine-given",
        label: "health.antiparasitics.form.notGiven",
    },
    givenDate: {
        id: "antiparasite-given-date",
        label: "health.sharedFields.givenDate",
        type: "date",
    },
    dueDate: {
        id: "antiparasite-due-date",
        label: "health.sharedFields.dueDate",
        type: "date",
    },
    notes: {
        id: "antiparasite-notes",
        label: "health.antiparasitics.form.notes",
        type: "text",
        placeholder: "health.sharedFields.notesPlaceholder"
    },
} as const;

export const vaccineFields = {
    types: {
        label: "health.vaccines.form.types",
        type: "checkbox",
        options: VACCINE_TYPES,
    },
    stage: {
        name: "vaccine-stage",
        label: "health.vaccines.form.stage",
        type: "radio",
        options: STAGE,
    },
    given: {
        id: "vaccine-given",
        label: "health.vaccines.form.given",
    },
    givenDate: {
        id: "vaccine-given-date",
        label: "health.sharedFields.givenDate",
        type: "date",
    },
    nextDose: {
        id: "vaccine-followUp",
        label: "health.sharedFields.nextDose",
    },
    dueDate: {
        id: "vaccine-due-date",
        label: "health.sharedFields.dueDate",
        type: "date",
    },
    vet: {
        id: "vaccine-vet",
        label: vetFields.label,
        placeholder: vetFields.placeholder
    },
    notes: {
        id: "vaccine-notes",
        label: "health.sharedFields.notes",
        placeholder: "health.sharedFields.notesPlaceholder"
    },
} as const;

export const vetVisitFields = {
    title: {
        id: "visit-title",
        label: "health.vet.visitForm.title",
    },
    date: {
        id: "visit-date",
        label: "health.vet.visitForm.date",
        type: "datetime-local",
    },
    vet: {
        id: "visit-vet",
        label: vetFields.label,
        placeholder: vetFields.placeholder
    },
    notes: {
        id: "visit-notes",
        label: "health.sharedFields.notes",
        placeholder: "health.sharedFields.notesPlaceholder"
    },
} as const;

export const vetFormFields = {
    name: {
        id: "vet-title",
        label: "health.vet.vetForm.name",
    },
    address1: {
        id: "vet-address1",
        label: "health.vet.vetForm.address1",
        required: true,
    },
    address2: {
        id: "vet-address2",
        label: "health.vet.vetForm.address2",
        required: false,
    },
    city: {
        id: "vet-city",
        label: "health.vet.vetForm.city",
        required: true,
    },
    postCode: {
        id: "vet-postCode",
        label: "health.vet.vetForm.postCode",
        inputmode: "numeric",
        required: true,
    },
    types: {
        label: "health.vet.vetForm.types",
        type: "checkbox",
        options: VET_TYPES
    },
    notes: {
        id: "vet-notes",
        label: "health.sharedFields.notes",
    },
    assignedPets: {
        label: "health.vet.vetForm.assignedPets",
        type: "checkbox",
    },
    phone: {
        id: "vet-phone",
        label: "health.vet.vetForm.phone",
        type: "tel",
    },
    email: {
        id: "vet-email",
        label: "health.vet.vetForm.email",
        type: "email",
    },
    hours: {
        id: "vet-hours",
        label: "health.vet.vetForm.hours",
    },
} as const;

export const logFields = {
    subtype: {
        name: "log-subtype",
        label: "pet.form.logType",
        type: "radio",
        options: LOG_SUBTYPES,
    },
    date: {
        id: "log-date",
        label: "pet.form.date",
        type: "date",
    },
    notes: {
        id: "log-notes",
        label: "pet.form.notes",
        type: "text",
        placeholder: "pet.form.notesPlaceholder"
    },
} as const;

export const treatmentFields = {
    name: {
        id: "treatment-name",
        label: "health.treatment.form.name",
    },
    startDate: {
        id: "treatment-start-date",
        label: "health.treatment.form.startDate",
        type: "date",
    },
    vet: {
        id: "treatment-vet",
        label: vetFields.label,
        placeholder: vetFields.placeholder
    },
    notes: {
        id: "treatment-notes",
        label: "health.sharedFields.notes",
        type: "text",
        placeholder: "health.sharedFields.notesPlaceholder"
    },
} as const;

export const lumpFields = {
    title: {
        id: "lump-title",
        label: "health.lumps.form.title",
    },
    location: {
        name: "lump-location",
        label: "health.lumps.form.location.label",
        type: "radio",
        options: [
            { id: "left", label: "health.lumps.form.location.left" },
            { id: "right", label: "health.lumps.form.location.right" }
        ]
    },
    size: {
        id: "lump-size",
        type: "number",
        label: "health.lumps.form.size"
    },
    status: {
        name: "lump-status",
        type: "radio",
        label: "health.lumps.form.status.label",
        options: LUMP_STATUS
    },
    notes: {
        id: "lump-notes",
        label: "health.sharedFields.notes",
        type: "text",
        placeholder: "health.sharedFields.notesPlaceholder"
    },
} as const;