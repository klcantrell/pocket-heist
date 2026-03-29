import { describe, it, expect, vi, beforeEach } from "vitest"
import { createHeist } from "@/lib/heist"
import type { CreateHeistInput } from "@/types/firestore"

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
}))

vi.mock("@/lib/firebase", () => ({
  db: { name: "mock-db" },
}))

import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

const mockAddDoc = vi.mocked(addDoc)
const mockCollection = vi.mocked(collection)

describe("createHeist", () => {
  const fakeCollectionRef = { id: "heists" }
  const fakeDocRef = { id: "new-heist-123" }

  const input: CreateHeistInput = {
    title: "Steal the stapler",
    description: "Take the red stapler from Milton",
    createdBy: "user1",
    createdByCodename: "SilentFox",
    assignedTo: "user2",
    assignedToCodename: "BoldEagle",
    deadline: new Date("2026-03-30T00:00:00Z"),
    finalStatus: null,
    createdAt: { isEqual: () => true } as never,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCollection.mockReturnValue(fakeCollectionRef as never)
    mockAddDoc.mockResolvedValue(fakeDocRef as never)
  })

  it("calls addDoc with the heists collection and input", async () => {
    await createHeist(input)

    expect(mockCollection).toHaveBeenCalledWith(db, "heists")
    expect(mockAddDoc).toHaveBeenCalledWith(fakeCollectionRef, input)
  })

  it("returns the new document ID", async () => {
    const result = await createHeist(input)

    expect(result).toBe("new-heist-123")
  })

  it("propagates Firestore errors", async () => {
    mockAddDoc.mockRejectedValue(new Error("permission-denied"))

    await expect(createHeist(input)).rejects.toThrow("permission-denied")
  })
})
