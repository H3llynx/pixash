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

export const STAGE = ["puppy", "adult"] as const;

export const vaccineFields = {
    types: {
        id: "vaccine-name",
        label: "health.form.types",
        type: "checkbox",
        options: VACCINE_TYPES,
    },
    stage: {
        id: "vaccine-stage",
        name: "vaccine-stage",
        label: "health.form.stage",
        type: "radio",
        options: STAGE,
    },
    givenDate: {
        id: "vaccine-given-date",
        label: "health.form.givenDate",
        type: "date",
    },
    nextDose: {
        id: "vaccine-followUp",
        label: "health.form.nextDose",
    },
    dueDate: {
        id: "vaccine-due-date",
        label: "health.form.dueDate",
        type: "date",
    },
    vet: {
        id: "vaccine-vet",
        label: "health.form.vet",
        type: "text",
    },
    notes: {
        id: "vaccine-notes",
        label: "health.form.notes",
    },
} as const;