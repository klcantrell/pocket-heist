import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

let snapshotCallback: ((snapshot: unknown) => void) | null = null
let errorCallback: ((error: Error) => void) | null = null
const mockUnsubscribe = vi.fn()

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ _col: true })),
  query: vi.fn((_col, ...constraints) => ({ _col, constraints })),
  where: vi.fn((field, op, value) => ({ field, op, value })),
  onSnapshot: vi.fn((_q, onNext, onError) => {
    snapshotCallback = onNext
    errorCallback = onError
    return mockUnsubscribe
  }),
}))

vi.mock("@/lib/firebase", () => ({
  db: {},
}))

vi.mock("@/contexts/AuthContext", () => ({
  useUser: vi.fn(() => ({
    user: { uid: "user1" },
    isLoading: false,
    logout: vi.fn(),
  })),
}))

vi.mock("@/types/firestore", () => ({
  COLLECTIONS: { HEISTS: "heists" },
  heistConverter: {
    toFirestore: (data: unknown) => data,
    fromFirestore: (snap: unknown) => snap,
  },
}))

import { collection } from "firebase/firestore"
import { useUser } from "@/contexts/AuthContext"
import { useHeists } from "@/hooks/useHeists"

const mockCollection = vi.mocked(collection)
const mockUseUser = vi.mocked(useUser)

// Mock withConverter on the collection return value
const mockWithConverter = vi.fn(() => ({ _converted: true }))
mockCollection.mockReturnValue({ withConverter: mockWithConverter } as never)

function makeSnapshot(docs: unknown[]) {
  return {
    docs: docs.map((d) => ({
      data: () => d,
    })),
  }
}

const futureDate = new Date(Date.now() + 86400000)
const pastDate = new Date(Date.now() - 86400000)

describe("useHeists", () => {
  beforeEach(() => {
    snapshotCallback = null
    errorCallback = null
    mockUnsubscribe.mockClear()
    mockUseUser.mockReturnValue({
      user: { uid: "user1" } as never,
      isLoading: false,
      logout: vi.fn(),
    })
  })

  it("returns empty array when user is null", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    })

    const { result } = renderHook(() => useHeists("active"))

    expect(result.current.heists).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it("filters active heists by future deadline", () => {
    const { result } = renderHook(() => useHeists("active"))

    act(() => {
      snapshotCallback?.(
        makeSnapshot([
          { id: "1", title: "Future", deadline: futureDate },
          { id: "2", title: "Past", deadline: pastDate },
        ]),
      )
    })

    expect(result.current.heists).toHaveLength(1)
    expect(result.current.heists[0].title).toBe("Future")
    expect(result.current.isLoading).toBe(false)
  })

  it("filters expired heists by past deadline and sorts descending", () => {
    const olderPast = new Date(Date.now() - 172800000)

    const { result } = renderHook(() => useHeists("expired"))

    act(() => {
      snapshotCallback?.(
        makeSnapshot([
          { id: "1", title: "Older", deadline: olderPast },
          { id: "2", title: "Recent", deadline: pastDate },
          { id: "3", title: "Future", deadline: futureDate },
        ]),
      )
    })

    expect(result.current.heists).toHaveLength(2)
    expect(result.current.heists[0].title).toBe("Recent")
    expect(result.current.heists[1].title).toBe("Older")
  })

  it("cleans up subscription on unmount", () => {
    const { unmount } = renderHook(() => useHeists("active"))

    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it("sets error state on snapshot error", () => {
    const { result } = renderHook(() => useHeists("active"))

    act(() => {
      errorCallback?.(new Error("permission-denied"))
    })

    expect(result.current.error?.message).toBe("permission-denied")
    expect(result.current.isLoading).toBe(false)
  })
})
