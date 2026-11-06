import { describe, expect, it } from "vitest";
import { friendRelation } from "./friend-relation";

const person = (id: number) => ({ id, username: `user${id}`, fullName: `User ${id}` });

const overview = {
  friends: [person(1)],
  pendingSent: [{ id: 50, to: person(2) }],
  pendingReceived: [{ id: 2, from: person(3) }],
};

describe("friendRelation", () => {
  it.each([
    [1, "friend"],
    [2, "request-sent"],
    [3, "request-received"],
    [4, "none"],
  ])("el usuario %i tiene relación %s", (userId, relation) => {
    expect(friendRelation(userId, overview)).toBe(relation);
  });

  it("no confunde el ID de una solicitud con el de un usuario", () => {
    expect(friendRelation(50, overview)).toBe("none");
  });
});
