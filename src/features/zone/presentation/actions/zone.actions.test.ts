import { beforeEach, describe, expect, it, vi } from "vitest";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { RoleName } from "@/shared/domain/enums";
import { zoneContainer } from "../../di/zone.container";
import {
  ZoneInUseError,
  ZoneNameRequiredError,
  ZoneNameTakenError,
  ZoneSelfParentError,
} from "../../domain/errors/zone-errors";
import { createZoneAction, deleteZoneAction, updateZoneAction } from "./zone.actions";
import { initialZoneFormState } from "./zone-form-state";

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
vi.mock("../../di/zone.container", () => ({
  zoneContainer: {
    createZoneUseCase: { execute: vi.fn() },
    updateZoneUseCase: { execute: vi.fn() },
    deleteZoneUseCase: { execute: vi.fn() },
  },
}));

const create = vi.mocked(zoneContainer.createZoneUseCase.execute);
const update = vi.mocked(zoneContainer.updateZoneUseCase.execute);
const remove = vi.mocked(zoneContainer.deleteZoneUseCase.execute);

const admin = { id: 1, email: "admin@citypulse.co", roles: [RoleName.ADMIN] };
const user = { id: 2, email: "ana@citypulse.co", roles: [RoleName.USER] };
const zone = { id: 4, name: "Granada", description: null, parentId: null, createdAt: "" };

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue(admin);
});

describe("createZoneAction", () => {
  it("crea la zona, refresca y limpia el formulario", async () => {
    create.mockResolvedValue(zone);

    const state = await createZoneAction(
      initialZoneFormState(),
      form({ name: "Granada", description: "", parentZoneId: "1" }),
    );

    expect(create).toHaveBeenCalledWith({ name: "Granada", description: "", parentZoneId: 1 });
    expect(refresh).toHaveBeenCalled();
    expect(state).toEqual({ ...initialZoneFormState(), success: 'Zona "Granada" creada.' });
  });

  it("sin zona padre envía null", async () => {
    create.mockResolvedValue(zone);

    await createZoneAction(initialZoneFormState(), form({ name: "Granada", parentZoneId: "" }));

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ parentZoneId: null }));
  });

  it("manda al login si no hay sesión", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    await expect(createZoneAction(initialZoneFormState(), form({ name: "Granada" }))).rejects.toThrow(
      "REDIRECT /login",
    );
    expect(redirect).toHaveBeenCalledWith("/login");
    expect(create).not.toHaveBeenCalled();
  });

  it("no deja crear zonas a quien no es ADMIN", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(user);

    const state = await createZoneAction(initialZoneFormState(), form({ name: "Granada" }));

    expect(state.error).toBe("Solo un administrador puede gestionar zonas.");
    expect(create).not.toHaveBeenCalled();
  });

  it.each([
    [new ZoneNameRequiredError(), "name"],
    [new ZoneNameTakenError(), "name"],
    [new ZoneSelfParentError(), "parentZoneId"],
  ])("muestra %s en el campo %s y conserva lo escrito", async (error, field) => {
    create.mockRejectedValue(error);

    const state = await createZoneAction(initialZoneFormState(), form({ name: "Granada" }));

    expect(state.errors).toEqual({ [field]: error.message });
    expect(state.values.name).toBe("Granada");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("no expone los errores inesperados", async () => {
    create.mockRejectedValue(new Error("detalle interno"));

    const state = await createZoneAction(initialZoneFormState(), form({ name: "Granada" }));

    expect(state.error).toBe("No se pudo conectar con el servidor. Intenta de nuevo.");
  });
});

describe("updateZoneAction", () => {
  it("edita la zona del formulario", async () => {
    update.mockResolvedValue(zone);

    const state = await updateZoneAction(
      initialZoneFormState(),
      form({ zoneId: "4", name: "Granada", description: "Comida", parentZoneId: "" }),
    );

    expect(update).toHaveBeenCalledWith(4, { name: "Granada", description: "Comida", parentZoneId: null });
    expect(state.success).toBe("Cambios guardados.");
    expect(refresh).toHaveBeenCalled();
  });

  it("no deja editar a quien no es ADMIN", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(user);

    const state = await updateZoneAction(initialZoneFormState(), form({ zoneId: "4", name: "X" }));

    expect(state.error).toBe("Solo un administrador puede gestionar zonas.");
    expect(update).not.toHaveBeenCalled();
  });
});

describe("deleteZoneAction", () => {
  it("borra la zona y vuelve al listado", async () => {
    remove.mockResolvedValue(undefined);

    await expect(deleteZoneAction({}, form({ zoneId: "4" }))).rejects.toThrow("REDIRECT /zones");
    expect(remove).toHaveBeenCalledWith(4);
  });

  it("explica por qué no se pudo borrar", async () => {
    remove.mockRejectedValue(new ZoneInUseError());

    const state = await deleteZoneAction({}, form({ zoneId: "4" }));

    expect(state.error).toBe("No se puede eliminar: la zona tiene lugares o eventos asociados");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("no deja borrar a quien no es ADMIN", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(user);

    const state = await deleteZoneAction({}, form({ zoneId: "4" }));

    expect(state.error).toBe("Solo un administrador puede gestionar zonas.");
    expect(remove).not.toHaveBeenCalled();
  });
});
