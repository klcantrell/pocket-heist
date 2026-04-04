import { describe, it, expect } from "vitest"
import { formatDate } from "@/lib/format"

describe("formatDate", () => {
  it("formats a date as 'Mon D, YYYY'", () => {
    const date = new Date(2026, 2, 30)
    expect(formatDate(date)).toBe("Mar 30, 2026")
  })

  it("formats a different date correctly", () => {
    const date = new Date(2025, 11, 25)
    expect(formatDate(date)).toBe("Dec 25, 2025")
  })
})
