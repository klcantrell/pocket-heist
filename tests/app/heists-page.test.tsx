import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/hooks/useHeists", () => ({
  useHeists: vi.fn(),
}))

vi.mock("@/contexts/AuthContext", () => ({
  useUser: () => ({
    user: { uid: "user1" },
    isLoading: false,
    logout: vi.fn(),
  }),
}))

import { useHeists } from "@/hooks/useHeists"
import HeistsPage from "@/app/(dashboard)/heists/page"

const mockUseHeists = vi.mocked(useHeists)

function mockReturn(heists: { id: string; title: string }[]) {
  return { heists, isLoading: false, error: null }
}

describe("HeistsPage", () => {
  it("renders three section headings", () => {
    mockUseHeists.mockReturnValue(mockReturn([]))

    render(<HeistsPage />)

    expect(
      screen.getByRole("heading", { name: "Your Active Heists" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Heists You've Assigned" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "All Expired Heists" }),
    ).toBeInTheDocument()
  })

  it("renders heist titles from each section", () => {
    mockUseHeists.mockImplementation((filter) => {
      if (filter === "active")
        return mockReturn([{ id: "1", title: "Steal the stapler" }])
      if (filter === "assigned")
        return mockReturn([{ id: "2", title: "Swap the coffee" }])
      return mockReturn([{ id: "3", title: "Old heist" }])
    })

    render(<HeistsPage />)

    expect(screen.getByText("Steal the stapler")).toBeInTheDocument()
    expect(screen.getByText("Swap the coffee")).toBeInTheDocument()
    expect(screen.getByText("Old heist")).toBeInTheDocument()
  })

  it("renders empty state without errors", () => {
    mockUseHeists.mockReturnValue(mockReturn([]))

    render(<HeistsPage />)

    expect(screen.getByText("No active heists right now.")).toBeInTheDocument()
    expect(
      screen.getByText("You haven't assigned any heists yet."),
    ).toBeInTheDocument()
    expect(screen.getByText("No expired heists yet.")).toBeInTheDocument()
  })

  it("calls useHeists with correct filter for each section", () => {
    mockUseHeists.mockReturnValue(mockReturn([]))

    render(<HeistsPage />)

    expect(mockUseHeists).toHaveBeenCalledWith("active")
    expect(mockUseHeists).toHaveBeenCalledWith("assigned")
    expect(mockUseHeists).toHaveBeenCalledWith("expired")
  })
})
