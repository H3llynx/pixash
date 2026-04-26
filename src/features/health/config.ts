export const VACCINE_TYPES = {
    dog: [
        { id: "rabies", label: "Rabies", defaultIntervalMonths: 12 },
        { id: "core-combo", label: "Core combo (DAPP)", defaultIntervalMonths: 12 },
        { id: "leish", label: "Leishmaniosis", defaultIntervalMonths: 12 },
    ],
    cat: [
        { id: "rabies", label: "Rabies", defaultIntervalMonths: 12 },
        { id: "core-combo", label: "Core combo (FVRCP)", defaultIntervalMonths: 36 },
        { id: "felv", label: "Feline leukemia (FeLV)", defaultIntervalMonths: 12 },
        { id: "fiv", label: "Feline immunodeficiency (FIV)", defaultIntervalMonths: 12 },
    ],
    smallMammal: [
        { id: "rabbit-myxorhd", label: "Rabbit: Myxomatosis + RHD", defaultIntervalMonths: 12 },
        { id: "ferret-rabies", label: "Ferret: Rabies", defaultIntervalMonths: 12 },
        { id: "ferret-distemper", label: "Ferret: Distemper", defaultIntervalMonths: 12 },
    ],
    default: [
        { id: "other", label: 'Other vaccine', defaultIntervalMonths: 12 },
    ],
} as const;

export const STAGE = [{ id: "young", label: "health.stage.young" }, { id: "adult", label: "health.stage.adult" }] as const;

export const VET_TYPES = [{ id: "primary", label: "health.vetTypes.primary" }, { id: "secondary", label: "health.vetTypes.secondary" }, { id: "emergency", label: "health.vetTypes.emergency" }]

const vetFields = {
    label: "health.vetVisitForm.vet",
    placeholder: "health.vetVisitForm.placeholderVet"
};

export const vaccineFields = {
    types: {
        id: "vaccine-name",
        label: "health.vaccineForm.types",
        type: "checkbox",
        options: VACCINE_TYPES,
    },
    stage: {
        id: "vaccine-stage",
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
        label: "health.vaccineForm.givenDate",
        type: "date",
    },
    nextDose: {
        id: "vaccine-followUp",
        label: "health.vaccineForm.nextDose",
    },
    dueDate: {
        id: "vaccine-due-date",
        label: "health.vaccineForm.dueDate",
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
        id: "vet-types",
        label: "health.vetForm.types",
        type: "checkbox",
        options: VET_TYPES
    },
    notes: {
        id: "vet-notes",
        label: "health.vetForm.notes",
    },
    assignedPets: {
        id: "vet-assignedPets",
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