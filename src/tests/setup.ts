import { Timestamp } from 'firebase/firestore'
import { vi } from 'vitest'
import { createApp, ref } from 'vue'
import type { AntiparasiteLogExtended, TreatmentExtended, VaccineExtended, VaccineRecord, VisitExtended, VisitRecord } from '../features/health/types'
import type { PetExtended } from '../features/pets/types'


export const withSetup = <T>(composable: () => T): [T, () => void] => {
    let result: T
    const app = createApp({
        setup() {
            result = composable()
            return () => { }
        },
    })
    app.mount(document.createElement('div'))
    const unmount = () => app.unmount()
    return [result!, unmount]
}

export const createMockPet = (index: number, overrides?: Partial<PetExtended>): PetExtended => ({
    id: String(index),
    ownerUid: "user-1",
    name: `pet-${index}`,
    species: "cat",
    birthDate: "13/07/2016",
    sex: "female",
    sterilized: true,
    microchipped: true,
    createdAt: Timestamp.fromDate(new Date("2026-05-21")),
    vaccines: [],
    vetVisits: [],
    treatments: [],
    logs: [],
    ...overrides,
});

export const createMockVaccine = (overrides?: Partial<VaccineExtended>): VaccineExtended => ({
    id: "vaccine-1",
    userId: "user-1",
    petId: "1",
    eventType: "vaccine",
    types: ["rabies"],
    stage: "adult",
    givenAt: Timestamp.fromDate(new Date("2025-12-01")),
    dueOn: Timestamp.fromDate(new Date("2026-12-01")),
    vet: "my-vet",
    notes: "",
    ts: Timestamp.fromDate(new Date("2026-12-01")),
    ...overrides,
});

export const createMockVaccineRecord = (overrides?: Partial<VaccineRecord>): VaccineRecord => ({
    types: ["rabies"],
    stage: "adult",
    givenAt: "2025-12-01",
    dueOn: "2026-12-01",
    vet: "my-vet",
    notes: "",
    ...overrides,
})

export const createMockVisit = (overrides?: Partial<VisitExtended>): VisitExtended => ({
    id: "visit-1",
    userId: "user-1",
    petId: "1",
    eventType: "visit",
    title: "Checkup",
    date: Timestamp.fromDate(new Date("2026-12-01")),
    vet: "my-vet",
    notes: '',
    ts: Timestamp.fromDate(new Date("2026-12-01")),
    ...overrides,
})

export const createMockVisitRecord = (overrides?: Partial<VisitRecord>): VisitRecord => ({
    title: "Checkup",
    date: "2026-12-01",
    vet: "my-vet",
    notes: '',
    ...overrides,
})

export const createMockTreatment = (overrides?: Partial<TreatmentExtended>): TreatmentExtended => ({
    id: "treatment-1",
    userId: "user-1",
    petId: "1",
    eventType: "treatment",
    name: 'Antibiotics',
    startDate: Timestamp.fromDate(new Date('2026-06-01')),
    endDate: null,
    vet: "La maquinista",
    notes: "",
    medication: [],
    ...overrides,
})

export const createMockAntiparasiteLog = (overrides?: Partial<AntiparasiteLogExtended>): AntiparasiteLogExtended => ({
    id: "log-1",
    userId: "user-1",
    petId: "1",
    eventType: "log",
    type: "antiparasite",
    treated: ["fleas"],
    givenAt: Timestamp.fromDate(new Date("2026-01-01")),
    ts: Timestamp.fromDate(new Date("2026-01-01")),
    notes: "",
    ...overrides,
})

vi.mock('../services/pets', () => ({
    fetchPets: vi.fn().mockResolvedValue([]),
    addPet: vi.fn(),
    updatePet: vi.fn(),
    deletePet: vi.fn(),
    deletePetField: vi.fn(),
}));

vi.mock('../services/careq', () => ({
    fetchPetVaccines: vi.fn().mockResolvedValue([]),
    fetchPetVisits: vi.fn().mockResolvedValue([]),
    fetchPetTreatments: vi.fn().mockResolvedValue([]),
    fetchPetLogs: vi.fn().mockResolvedValue([]),
    fetchVets: vi.fn().mockResolvedValue([]),
    addVaccine: vi.fn(),
    updateVaccine: vi.fn(),
    deleteVaccine: vi.fn(),
    addVetVisit: vi.fn(),
    updateVetVisit: vi.fn(),
    deleteVisit: vi.fn(),
    deleteVet: vi.fn(),
    addLog: vi.fn(),
    updateLog: vi.fn(),
    deleteLog: vi.fn(),
    addTreatment: vi.fn(),
    deleteTreatment: vi.fn(),
}));

vi.mock('../features/user/composables/useAuth', () => ({
    useAuth: () => ({ user: ref({ uid: "user-1" }) }),
}));

export const mockVet = { id: "vet-1", name: "Vet 1", address1: "Rue du petit chat", postCode: "65100", city: "MiaouVille" }