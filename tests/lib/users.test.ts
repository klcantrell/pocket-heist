import { describe, it, expect, vi, beforeEach } from "vitest"
import { fetchUsers } from "@/lib/users"

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}))

vi.mock("@/lib/firebase", () => ({
  db: { name: "mock-db" },
}))

import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const mockCollection = vi.mocked(collection)
const mockGetDocs = vi.mocked(getDocs)

describe("fetchUsers", () => {
  const fakeCollectionRef = { id: "users" }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCollection.mockReturnValue(fakeCollectionRef as never)
  })

  it("queries the users collection", async () => {
    mockGetDocs.mockResolvedValue({ docs: [] } as never)

    await fetchUsers()

    expect(mockCollection).toHaveBeenCalledWith(db, "users")
    expect(mockGetDocs).toHaveBeenCalledWith(fakeCollectionRef)
  })

  it("maps snapshot docs to User objects", async () => {
    mockGetDocs.mockResolvedValue({
      docs: [
        { id: "user1", data: () => ({ codename: "SilentFox" }) },
        { id: "user2", data: () => ({ codename: "BoldEagle" }) },
      ],
    } as never)

    const result = await fetchUsers()

    expect(result).toEqual([
      { id: "user1", codename: "SilentFox" },
      { id: "user2", codename: "BoldEagle" },
    ])
  })

  it("returns empty array when no users exist", async () => {
    mockGetDocs.mockResolvedValue({ docs: [] } as never)

    const result = await fetchUsers()

    expect(result).toEqual([])
  })

  it("propagates Firestore errors", async () => {
    mockGetDocs.mockRejectedValue(new Error("permission-denied"))

    await expect(fetchUsers()).rejects.toThrow("permission-denied")
  })
})
