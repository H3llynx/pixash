export const DB = {
    users: "users",
    pets: "pets",
    vets: "vets",
    vaccines: "vaccines",
    vetVisits: "vetVisits",
    treatments: "treatments",
    logs: "logs",
    weightLogs: "weightLogs"
} as const;

export const phonePattern = "\\+?[\\d\\s]{6,15}";