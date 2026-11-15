import { beforeEach, describe, expect, it, vi } from "vitest";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { RoleName } from "@/shared/domain/enums";
import { venueContainer } from "../../di/venue.container";
import { VenueForbiddenError, VenueNameTakenError } from "../../domain/errors/venue-errors";
import { createVenueAction, deleteVenueAction, updateVenueAction, verifyVenueAction } from "./venue.actions";
import { initialVenueFormState } from "./venue-form-state";

vi.mock("next/cache", () => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({
  // redirect() de verdad lanza una excepción para cortar la ejecución
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT ${path}`);
  }),
}));
vi.mock("@/features/auth/infrastructure/session/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("../../di/venue.container", () => ({
  venueContainer: {
    createVenueUseCase: { execute: vi.fn() },
    updateVenueUseCase: { execute: vi.fn() },
    deleteVenueUseCase: { execute: vi.fn() },
    verifyVenueUseCase: { execute: vi.fn() },
  },
}));

const create = vi.mocked(venueContainer.createVenueUseCase.execute);
const update = vi.mocked(venueContainer.updateVenueUseCase.execute);
const remove = vi.mocked(venueContainer.deleteVenueUseCase.execute);
const verify = vi.mocked(venueContainer.verifyVenueUseCase.execute);

const owner = { id: 2, email: "teatro@citypulse.co", roles: [RoleName.USER, RoleName.OWNER] };
const admin = { id: 1, email: "admin@citypulse.co", roles: [RoleName.ADMIN] };

const venue = {
  id: 7,
  name: "Teatro",
  description: null,
  address: "Cra 5",
  isVerified: true,
  zone: { id: 2, name: "Centro" },
  owner: { id: 2, username: "teatro", fullName: "Teatro" },
  createdAt: "",
};
const fields = { name: "Teatro", address: "Cra 5", description: "", zoneId: "2" };

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue(owner);
});

describe("createVenueAction", () => {
  it("registra el lugar y lleva a su detalle", async () => {
    create.mockResolvedValue(venue);

    await expect(createVenueAction(initialVenueFormState(), form(fields))).rejects.toThrow("REDIRECT /venues/7");
    expect(create).toHaveBeenCalledWith({ name: "Teatro", address: "Cra 5", description: "", zoneId: 2 });
  });

  // Un ADMIN tampoco registra lugares: el dueño del lugar es siempre quien lo registra (RF-2.3)
  it("no deja registrar a quien no es OWNER, ni siquiera al ADMIN", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(admin);

    const state = await createVenueAction(initialVenueFormState(), form(fields));

    expect(state.error).toBe("Solo los dueños de lugares (OWNER) pueden registrarlos.");
    expect(create).not.toHaveBeenCalled();
  });

  it("muestra el nombre repetido en su campo y conserva lo escrito", async () => {
    create.mockRejectedValue(new VenueNameTakenError());

    const state = await createVenueAction(initialVenueFormState(), form(fields));

    expect(state.errors).toEqual({ name: "Ya existe un lugar con ese nombre en esa zona" });
    expect(state.values).toEqual(fields);
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("updateVenueAction", () => {
  it("avisa si el lugar perdió la verificación", async () => {
    update.mockResolvedValue({ ...venue, isVerified: false });

    const state = await updateVenueAction(initialVenueFormState(), form({ ...fields, venueId: "7" }));

    expect(update).toHaveBeenCalledWith(7, { name: "Teatro", address: "Cra 5", description: "", zoneId: 2 });
    expect(state.success).toBe(
      "Cambios guardados. El lugar queda pendiente de que un administrador lo verifique.",
    );
    expect(refresh).toHaveBeenCalled();
  });

  it("explica cuando el lugar no es suyo", async () => {
    update.mockRejectedValue(new VenueForbiddenError());

    const state = await updateVenueAction(initialVenueFormState(), form({ ...fields, venueId: "7" }));

    expect(state.error).toBe("Solo puedes administrar tus propios lugares");
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe("deleteVenueAction", () => {
  it("el OWNER vuelve a sus lugares", async () => {
    remove.mockResolvedValue(undefined);

    await expect(deleteVenueAction({}, form({ venueId: "7" }))).rejects.toThrow("REDIRECT /venues/mine");
    expect(remove).toHaveBeenCalledWith(7);
  });

});

describe("verifyVenueAction", () => {
  it("el ADMIN verifica y se refresca la página", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(admin);
    verify.mockResolvedValue(venue);

    await expect(verifyVenueAction({}, form({ venueId: "7" }))).resolves.toEqual({});
    expect(verify).toHaveBeenCalledWith(7);
    expect(refresh).toHaveBeenCalled();
  });

  it("no deja verificar a un OWNER", async () => {
    const state = await verifyVenueAction({}, form({ venueId: "7" }));

    expect(state.error).toBe("Solo un administrador puede verificar lugares.");
    expect(verify).not.toHaveBeenCalled();
  });
});
