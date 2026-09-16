export const DB = {
    users: "users",
    pets: "pets",
    vets: "vets",
    vaccines: "vaccines",
    vetVisits: "vetVisits",
    treatments: "treatments",
    lumps: "lumps",
    logs: "logs",
    weightLogs: "weightLogs"
} as const;

export const phonePattern = "\\+?[\\d\\s]{6,15}";