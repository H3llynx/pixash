import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCare } from '../../features/care/composables/useCare';
import type { LogExtended, TreatmentExtended, VaccineExtended, VisitExtended } from '../../features/care/types';
import {
    addLog,
    addTreatment,
    addVaccine,
    addVetVisit,
    deleteLog,
    deleteTreatment,
    deleteVaccine,
    deleteVet,
    deleteVisit,
    fetchPetLogs,
    fetchPetTreatments,
    fetchPetVaccines, fetchPetVisits,
    fetchVets,
    updateVaccine
} from '../../services/care';
import { createMockAntiparasiteLog, createMockPet, createMockTreatment, createMockVaccine, createMockVaccineRecord, createMockVisit, createMockVisitRecord, mockVet, withSetup } from '../setup';

const mockRefresh = (
    vaccines: VaccineExtended[] = [],
    vetVisits: VisitExtended[] = [],
    treatments: TreatmentExtended[] = [],
    logs: LogExtended[] = []
) => {
    vi.mocked(fetchPetVaccines).mockResolvedValue(vaccines)
    vi.mocked(fetchPetVisits).mockResolvedValue(vetVisits)
    vi.mocked(fetchPetTreatments).mockResolvedValue(treatments)
    vi.mocked(fetchPetLogs).mockResolvedValue(logs)
}

describe("useCare", () => {
    describe("computed collections", () => {
        it("flattens vaccines from all pets", () => {
            const vaccine1 = createMockVaccine({ id: "v1", petId: "1" });
            const vaccine2 = createMockVaccine({ id: "v2", petId: "2" });
            const pets = ref([
                createMockPet(1, { vaccines: [vaccine1] }),
                createMockPet(2, { vaccines: [vaccine2] }),
            ]);
            const [result, unmount] = withSetup(() => useCare(pets));
            expect(result.vaccines.value).toEqual([vaccine1, vaccine2]);
            unmount();
        })

        it("flattens vetVisits from all pets", () => {
            const visit = createMockVisit({ id: "vis1", petId: "1" });
            const pets = ref([createMockPet(1, { vetVisits: [visit] })]);
            const [result, unmount] = withSetup(() => useCare(pets));
            expect(result.vetVisits.value).toEqual([visit]);
            unmount();
        })

        it('flattens logs from all pets', () => {
            const log = createMockAntiparasiteLog({ id: "log1", petId: "1" });
            const pets = ref([createMockPet(1, { logs: [log] })]);
            const [result, unmount] = withSetup(() => useCare(pets));
            expect(result.logs.value).toEqual([log]);
            unmount();
        })

        it("flattens treatments from all pets", () => {
            const treatment = createMockTreatment({ id: "t1", petId: "1" });
            const pets = ref([createMockPet(1, { treatments: [treatment] })]);
            const [result, unmount] = withSetup(() => useCare(pets));
            expect(result.treatments.value).toEqual([treatment]);
            unmount();
        })
    });

    describe("select functions reset each other", () => {
        it("selectVaccine clears visit and treatment", () => {
            const pets = ref([createMockPet(1)])
            const [result, unmount] = withSetup(() => useCare(pets))
            const vaccine = createMockVaccine()
            const visit = createMockVisit()

            result.selectVisit(visit)
            result.selectVaccine(vaccine)

            expect(result.selectedVaccine.value).toEqual(vaccine)
            expect(result.selectedVisit.value).toBeNull()
            expect(result.selectedTreatment.value).toBeNull()
            unmount()
        })

        it("selectVisit clears vaccine and treatment", () => {
            const pets = ref([createMockPet(1)])
            const [result, unmount] = withSetup(() => useCare(pets))
            const vaccine = createMockVaccine()
            const visit = createMockVisit()

            result.selectVaccine(vaccine)
            result.selectVisit(visit)

            expect(result.selectedVisit.value).toEqual(visit)
            expect(result.selectedVaccine.value).toBeNull()
            expect(result.selectedTreatment.value).toBeNull()
            unmount()
        })

        it("selectTreatment clears vaccine and visit", () => {
            const pets = ref([createMockPet(1)])
            const [result, unmount] = withSetup(() => useCare(pets))
            const treatment = createMockTreatment()

            result.selectVaccine(createMockVaccine())
            result.selectTreatment(treatment)

            expect(result.selectedTreatment.value).toEqual(treatment)
            expect(result.selectedVaccine.value).toBeNull()
            expect(result.selectedVisit.value).toBeNull()
            unmount()
        })
    });

    describe("vaccines", () => {
        it("addNewVaccine calls service and refreshes pet", async () => {
            const vaccine = createMockVaccine();
            const pets = ref([createMockPet(1)]);
            mockRefresh([vaccine]);
            vi.mocked(addVaccine).mockResolvedValue("vaccine-1");
            const [result, unmount] = withSetup(() => useCare(pets));
            await result.addNewVaccine(createMockVaccineRecord(), "1");
            expect(addVaccine).toHaveBeenCalledWith(createMockVaccineRecord(), "1", "user-1")
            expect(pets.value[0].vaccines).toEqual([vaccine]);
            expect(result.isAddingCare.vaccine).toBe(false);
            unmount();
        });

        it("updateSelectedVaccine calls service, refreshes and deselects", async () => {
            const vaccine = createMockVaccine();
            const pets = ref([createMockPet(1, { vaccines: [vaccine] })]);
            const updatedVaccine = createMockVaccine({ types: ["leish"] });
            mockRefresh([updatedVaccine]);
            const [result, unmount] = withSetup(() => useCare(pets))
            result.selectVaccine(vaccine);
            await result.updateSelectedVaccine(vaccine, "1", createMockVaccineRecord({ types: ["leish"] }));
            expect(updateVaccine).toHaveBeenCalled();
            expect(result.selectedVaccine.value).toBeNull();
            unmount();
        });

        it("deleteSelectedVaccine calls service, refreshes and deselects", async () => {
            const vaccine = createMockVaccine();
            const pets = ref([createMockPet(1, { vaccines: [vaccine] })]);
            mockRefresh([]);
            vi.mocked(deleteVaccine).mockResolvedValue(undefined);

            const [result, unmount] = withSetup(() => useCare(pets));
            result.selectVaccine(vaccine);
            await result.deleteSelectedVaccine(vaccine, '1');

            expect(deleteVaccine).toHaveBeenCalled();
            expect(pets.value[0].vaccines).toEqual([]);
            expect(result.selectedVaccine.value).toBeNull();
            unmount();
        })
    });

    describe("vet visits", () => {
        it("addNewVetVisit calls service and refreshes pet", async () => {
            const visit = createMockVisit();
            const pets = ref([createMockPet(1)]);
            mockRefresh([], [visit]);
            vi.mocked(addVetVisit).mockResolvedValue("visit-1");
            const [result, unmount] = withSetup(() => useCare(pets));
            await result.addNewVetVisit(createMockVisitRecord(), "1");
            expect(addVetVisit).toHaveBeenCalled();
            expect(pets.value[0].vetVisits).toEqual([visit]);
            expect(result.isAddingCare.visit).toBe(false);
            unmount();
        });

        it("deleteSelectedVisit deselects and refreshes", async () => {
            const visit = createMockVisit();
            const pets = ref([createMockPet(1, { vetVisits: [visit] })]);
            mockRefresh([], []);
            vi.mocked(deleteVisit).mockResolvedValue(undefined);
            const [result, unmount] = withSetup(() => useCare(pets));
            result.selectVisit(visit);
            await result.deleteSelectedVisit(visit, "1");
            expect(result.selectedVisit.value).toBeNull();
            expect(pets.value[0].vetVisits).toEqual([]);
            unmount();
        })
    });

    describe("vets", () => {

        it("fetchUserVets populates vets list", async () => {
            vi.mocked(fetchVets).mockResolvedValue([mockVet]);
            const pets = ref([createMockPet(1)]);
            const [result, unmount] = withSetup(() => useCare(pets));
            await result.fetchUserVets();
            expect(result.vets.value).toEqual([mockVet]);
            unmount();
        })

        it("deleteSelectedVet removes vet and refetches", async () => {
            const pets = ref([createMockPet(1)]);
            vi.mocked(deleteVet).mockResolvedValue(undefined)
            vi.mocked(fetchVets).mockResolvedValue([])
            const [result, unmount] = withSetup(() => useCare(pets));
            await result.fetchUserVets();
            await result.deleteSelectedVet(mockVet);
            expect(result.vets.value).toEqual([]);
            unmount()
        });
    });

    describe('logs', () => {
        it("addNewLog calls service and refreshes pet", async () => {
            const log = createMockAntiparasiteLog();
            const pets = ref([createMockPet(1)]);
            mockRefresh([], [], [], [log]);
            vi.mocked(addLog).mockResolvedValue("log-1");
            const [result, unmount] = withSetup(() => useCare(pets));
            const id = await result.addNewLog({ type: "antiparasite", treated: ["fleas"], givenAt: "2026-05-18" }, '1');
            expect(id).toBe("log-1");
            expect(pets.value[0].logs).toEqual([log]);
            unmount();
        });

        it("deleteSelectedLog resets selectedLog", async () => {
            const log = createMockAntiparasiteLog();
            const pets = ref([createMockPet(1, { logs: [log] })]);
            mockRefresh([], [], [], []);
            vi.mocked(deleteLog).mockResolvedValue(undefined);
            const [result, unmount] = withSetup(() => useCare(pets));
            result.selectLog(log, "antiparasitic");
            await result.deleteSelectedLog(log, "1");
            expect(result.selectedLog.antiparasitic).toBeNull();
            unmount();
        })
    });

    describe("treatments", () => {
        it("addNewTreatment calls service and refreshes pet", async () => {
            const treatment = createMockTreatment();
            const pets = ref([createMockPet(1)]);
            mockRefresh([], [], [treatment]);
            vi.mocked(addTreatment).mockResolvedValue("treatment-1");
            const [result, unmount] = withSetup(() => useCare(pets));
            await result.addNewTreatment({ name: "Antibiotics", startDate: "2026-05-18", vet: "vet-1", medication: [] }, "1");
            expect(addTreatment).toHaveBeenCalled();
            expect(pets.value[0].treatments).toEqual([treatment]);
            expect(result.isAddingCare.treatment).toBe(false);
            unmount();
        })

        it("deleteSelectedTreatment deselects and refreshes", async () => {
            const treatment = createMockTreatment();
            const pets = ref([createMockPet(1, { treatments: [treatment] })]);
            mockRefresh([], [], []);
            vi.mocked(deleteTreatment).mockResolvedValue(undefined);
            const [result, unmount] = withSetup(() => useCare(pets));
            result.selectTreatment(treatment);
            await result.deleteSelectedTreatment(treatment, "1");
            expect(result.selectedTreatment.value).toBeNull();
            expect(pets.value[0].treatments).toEqual([]);
            unmount();
        })
    });
});