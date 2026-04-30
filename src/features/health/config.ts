export const VACCINE_TYPES = {
    dog: [
        { id: "rabies", label: "Rabies" },
        { id: "core-combo", label: "Core combo (DAPP)" },
        { id: "leish", label: "Leishmaniosis" },
    ],
    cat: [
        { id: "rabies", label: "Rabies" },
        { id: "core-combo", label: "Core combo (FVRCP)" },
        { id: "felv", label: "Feline leukemia (FeLV)" },
        { id: "fiv", label: "Feline immunodeficiency (FIV)" },
    ],
    smallMammal: [
        { id: "rabbit-myxorhd", label: "Rabbit: Myxomatosis + RHD" },
        { id: "ferret-rabies", label: "Ferret: Rabies" },
        { id: "ferret-distemper", label: "Ferret: Distemper" },
    ],
    default: [
        { id: "other", label: 'Other vaccine' },
    ],
} as const;

const PARASITES = {
    worms: { id: "worms", label: "health.parasites.worms" },
    fleas: { id: "fleas", label: "health.parasites.fleas" },
    lice: { id: "lice", label: "health.parasites.lice" },
    ticks: { id: "ticks", label: "health.parasites.ticks" },
    heartworm: { id: "heartworm", label: "health.parasites.heartworms" },
    mites: { id: "mites", label: "health.parasites.mites" },
    protozoa: { id: "protozoa", label: "health.parasites.protozoa" },
    other: { id: "other", label: "health.parasites.other" }
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

export const STAGE = [{ id: "young", label: "health.stage.young" }, { id: "adult", label: "health.stage.adult" }] as const;

export const VET_TYPES = [{ id: "primary", label: "health.vetTypes.primary" }, { id: "secondary", label: "health.vetTypes.secondary" }, { id: "emergency", label: "health.vetTypes.emergency" }]

const vetFields = {
    label: "health.vetVisitForm.vet",
    placeholder: "health.vetVisitForm.placeholderVet"
};

export const antiparasiteFields = {
    treated: {
        label: "health.antiparasiteForm.treated",
        type: "checkbox",
        options: ANTIPARASITE_TYPES,
    },
    givenDate: {
        id: "antiparasite-given-date",
        label: "health.sharedDateFields.givenDate",
        type: "date",
    },
    dueDate: {
        id: "antiparasite-due-date",
        label: "health.sharedDateFields.dueDate",
        type: "date",
    },
    product: {
        id: "antiparasite-product",
        label: "health.antiparasiteForm.product",
        type: "text",
    },
}

export const vaccineFields = {
    types: {
        label: "health.vaccineForm.types",
        type: "checkbox",
        options: VACCINE_TYPES,
    },
    stage: {
        name: "vaccine-stage",
        label: "health.vaccineForm.stage",
        type: "radio",
        options: STAGE,
    },
    given: {
        id: "vaccine-given",
        label: "health.vaccineForm.given",
    },
    givenDate: {
        id: "vaccine-given-date",
        label: "health.sharedDateFields.givenDate",
        type: "date",
    },
    nextDose: {
        id: "vaccine-followUp",
        label: "health.sharedDateFields.nextDose",
    },
    dueDate: {
        id: "vaccine-due-date",
        label: "health.sharedDateFields.dueDate",
        type: "date",
    },
    vet: {
        id: "vaccine-vet",
        label: vetFields.label,
        placeholder: vetFields.placeholder
    },
    notes: {
        id: "vaccine-notes",
        label: "health.vaccineForm.notes",
    },
} as const;

export const vetVisitFields = {
    title: {
        id: "visit-title",
        label: "health.vetVisitForm.title",
    },
    date: {
        id: "visit-date",
        label: "health.vetVisitForm.date",
        type: "date",
    },
    vet: {
        id: "visit-vet",
        label: vetFields.label,
        placeholder: vetFields.placeholder
    },
    notes: {
        id: "visit-notes",
        label: "health.vetVisitForm.notes",
    },
} as const;

export const vetFormFields = {
    name: {
        id: "vet-title",
        label: "health.vetForm.name",
    },
    address1: {
        id: "vet-address1",
        label: "health.vetForm.address1",
        required: true,
    },
    address2: {
        id: "vet-address2",
        label: "health.vetForm.address2",
        required: false,
    },
    city: {
        id: "vet-city",
        label: "health.vetForm.city",
        required: true,
    },
    postCode: {
        id: "vet-postCode",
        label: "health.vetForm.postCode",
        inputmode: "numeric",
        required: true,
    },
    types: {
        label: "health.vetForm.types",
        type: "checkbox",
        options: VET_TYPES
    },
    notes: {
        id: "vet-notes",
        label: "health.vetForm.notes",
    },
    assignedPets: {
        label: "health.vetForm.assignedPets",
        type: "checkbox",
    },
    phone: {
        id: "vet-phone",
        label: "health.vetForm.phone",
        type: "tel",
    },
    email: {
        id: "vet-email",
        label: "health.vetForm.email",
        type: "email",
    },
    hours: {
        id: "vet-hours",
        label: "health.vetForm.hours",
    },
} as const;