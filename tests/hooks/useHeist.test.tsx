import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

let snapshotCallback: ((snapshot: unknown) => void) | null = null
let errorCallback: ((error: Error) => void) | null = null
const mockUnsubscribe = vi.fn()

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => ({ _doc: true })),
  onSnapshot: vi.fn((_ref, onNext, onError) => {
    snapshotCallback = onNext
    errorCallback = onError
    return mockUnsubscribe
  }),
}))

vi.mock("@/lib/firebase", () => ({
  db: {},
}))

vi.mock("@/types/firestore", () => ({
  COLLECTIONS: { HEISTS: "heists" },
  heistConverter: {
    toFirestore: (data: unknown) => data,
    fromFirestore: (snap: unknown) => snap,
  },
}))

import { doc } from "firebase/firestore"
import { useHeist } from "@/hooks/useHeist"

const mockDoc = vi.mocked(doc)
const mockWithConverter = vi.fn(() => ({ _converted: true }))
mockDoc.mockReturnValue({ withConverter: mockWithConverter } as never)

describe("useHeist", () => {
  beforeEach(() => {
    snapshotCallback = null
    errorCallback = null
    mockUnsubscribe.mockClear()
  })

  it("returns heist data when document exists", () => {
    const { result } = renderHook(() => useHeist("heist-1"))

    const heistData = { id: "heist-1", title: "Test Heist" }
    act(() => {
      snapshotCallback?.({
        exists: () => true,
        data: () => heistData,
      })
    })

    expect(result.current.heist).toEqual(heistData)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("returns null when document does not exist", () => {
    const { result } = renderHook(() => useHeist("missing"))

    act(() => {
      snapshotCallback?.({
        exists: () => false,
        data: () => null,
      })
    })

    expect(result.current.heist).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it("starts in loading state", () => {
    const { result } = renderHook(() => useHeist("heist-1"))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.heist).toBeNull()
  })

  it("sets error state on snapshot error", () => {
    const { result } = renderHook(() => useHeist("heist-1"))

    act(() => {
      errorCallback?.(new Error("permission-denied"))
    })

    expect(result.current.error?.message).toBe("permission-denied")
    expect(result.current.isLoading).toBe(false)
  })

  it("cleans up subscription on unmount", () => {
    const { unmount } = renderHook(() => useHeist("heist-1"))

    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
