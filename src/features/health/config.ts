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
        { id: "other", label: 'Other vaccine', defaultIntervalMonths: 12 },
    ],
    default: [
        { id: "other", label: 'Other vaccine', defaultIntervalMonths: 12 },
    ],
} as const;