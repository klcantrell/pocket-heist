import { describe, it, expect } from "vitest"
import { generateCodename } from "@/lib/codename"

describe("generateCodename", () => {
  it("returns a string", () => {
    expect(typeof generateCodename()).toBe("string")
  })

  it("produces a PascalCase string of three capitalized segments", () => {
    const codename = generateCodename()
    const segments = codename.match(/[A-Z][a-z]+/g)
    expect(segments).not.toBeNull()
    expect(segments).toHaveLength(3)
  })

  it("produces varying results across multiple calls", () => {
    const results = new Set(
      Array.from({ length: 20 }, () => generateCodename()),
    )
    expect(results.size).toBeGreaterThan(1)
  })
})
