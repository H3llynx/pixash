import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePets } from '../../features/pets/composables/usePets';
import { addPet, deletePet, fetchPets } from '../../services/pets';
import { createMockPet, withSetup } from '../setup';

const mockPet = createMockPet(1);

beforeEach(() => {
    vi.mocked(fetchPets).mockResolvedValue([mockPet])
    vi.mocked(addPet).mockResolvedValue("2")
});

describe("usePets", () => {
    it("fetches pets and auto-selects the first one", async () => {
        const [result, unmount] = withSetup(() => usePets());
        await result.fetchUserPets();
        expect(result.pets.value).toHaveLength(1);
        expect(result.selectedPet.value?.id).toBe("1");
        unmount();
    });

    it("sets isAddingPet=true when no pets exist", async () => {
        vi.mocked(fetchPets).mockResolvedValue([]);
        const [result, unmount] = withSetup(() => usePets());
        await result.fetchUserPets();
        expect(result.isAddingPet.value).toBe(true);
        unmount();
    });

    it("adds a pet and selects it", async () => {
        vi.mocked(fetchPets).mockResolvedValue([createMockPet(1), createMockPet(2)])
        const [result, unmount] = withSetup(() => usePets());
        await result.addNewPet(createMockPet(2));
        expect(result.pets.value).toHaveLength(2);
        expect(result.selectedPet.value?.id).toBe("2");
        expect(result.isAddingPet.value).toBe(false);
        unmount();
    });

    it("clears selectedPet and refetches on delete", async () => {
        vi.mocked(deletePet).mockResolvedValue(undefined);
        vi.mocked(fetchPets).mockResolvedValue([]);
        const [result, unmount] = withSetup(() => usePets());

        await result.fetchUserPets();
        await result.deleteSelectedPet(result.selectedPet.value!);

        expect(result.selectedPet.value).toBeNull();
        unmount();
    });
})