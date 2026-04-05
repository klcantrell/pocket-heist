import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useTimeRemaining } from "@/hooks/useTimeRemaining"

describe("useTimeRemaining", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows time remaining for a future deadline", () => {
    const deadline = new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000)
    const { result } = renderHook(() => useTimeRemaining(deadline))

    expect(result.current.isExpired).toBe(false)
    expect(result.current.hours).toBe(2)
    expect(result.current.minutes).toBe(30)
    expect(result.current.label).toContain("2h")
    expect(result.current.label).toContain("30m")
  })

  it("shows expired for a past deadline", () => {
    const deadline = new Date(Date.now() - 1000)
    const { result } = renderHook(() => useTimeRemaining(deadline))

    expect(result.current.isExpired).toBe(true)
    expect(result.current.label).toBe("Time's up")
  })

  it("updates every second", () => {
    const deadline = new Date(Date.now() + 5000)
    const { result } = renderHook(() => useTimeRemaining(deadline))

    expect(result.current.seconds).toBe(5)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.seconds).toBe(3)
  })

  it("transitions to expired when time runs out", () => {
    const deadline = new Date(Date.now() + 2000)
    const { result } = renderHook(() => useTimeRemaining(deadline))

    expect(result.current.isExpired).toBe(false)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.isExpired).toBe(true)
  })
})
