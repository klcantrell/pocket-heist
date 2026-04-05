import { render, screen, act } from "@testing-library/react"
import { Suspense } from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock("@/hooks/useHeist", () => ({
  useHeist: vi.fn(),
}))

vi.mock("@/hooks/useTimeRemaining", () => ({
  useTimeRemaining: vi.fn(() => ({
    hours: 12,
    minutes: 30,
    seconds: 45,
    isExpired: false,
    label: "12h 30m 45s",
  })),
}))

import { useHeist } from "@/hooks/useHeist"
import { useTimeRemaining } from "@/hooks/useTimeRemaining"
import HeistDetailsPage from "@/app/(dashboard)/heists/[id]/page"

const mockUseHeist = vi.mocked(useHeist)
const mockUseTimeRemaining = vi.mocked(useTimeRemaining)

const mockHeist = {
  id: "heist-1",
  title: "Steal the stapler",
  description: "Sneak into the boss's office and take the red stapler.",
  createdBy: "user1",
  createdByCodename: "Agent Fox",
  assignedTo: "user2",
  assignedToCodename: "Agent Wolf",
  deadline: new Date(2099, 3, 5),
  finalStatus: null,
  createdAt: new Date(2026, 2, 30),
}

describe("HeistDetailsPage", () => {
  beforeEach(() => {
    mockUseHeist.mockReturnValue({
      heist: mockHeist,
      isLoading: false,
      error: null,
    })
    mockUseTimeRemaining.mockReturnValue({
      hours: 12,
      minutes: 30,
      seconds: 45,
      isExpired: false,
      label: "12h 30m 45s",
    })
  })

  async function renderPage() {
    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <HeistDetailsPage params={Promise.resolve({ id: "heist-1" })} />
        </Suspense>,
      )
    })
  }

  it("renders the heist title", async () => {
    await renderPage()

    expect(
      screen.getByRole("heading", { name: "Steal the stapler" }),
    ).toBeInTheDocument()
  })

  it("renders assigned to and created by codenames", async () => {
    await renderPage()

    expect(screen.getByText("Agent Wolf")).toBeInTheDocument()
    expect(screen.getByText("Agent Fox")).toBeInTheDocument()
  })

  it("renders the heist description", async () => {
    await renderPage()

    expect(
      screen.getByText(
        "Sneak into the boss's office and take the red stapler.",
      ),
    ).toBeInTheDocument()
  })

  it("renders time remaining", async () => {
    await renderPage()

    expect(screen.getByText("12h 30m 45s")).toBeInTheDocument()
  })

  it("renders back link to heists list", async () => {
    await renderPage()

    const backLink = screen.getByRole("link", { name: /back to heists/i })
    expect(backLink).toHaveAttribute("href", "/heists")
  })

  it("shows not found when heist does not exist", async () => {
    mockUseHeist.mockReturnValue({
      heist: null,
      isLoading: false,
      error: null,
    })

    await renderPage()

    expect(screen.getByText("Heist not found.")).toBeInTheDocument()
  })

  it("shows error message on failure", async () => {
    mockUseHeist.mockReturnValue({
      heist: null,
      isLoading: false,
      error: new Error("permission-denied"),
    })

    await renderPage()

    expect(
      screen.getByText("Failed to load heist: permission-denied"),
    ).toBeInTheDocument()
  })

  it("shows status badge for completed heist", async () => {
    mockUseHeist.mockReturnValue({
      heist: { ...mockHeist, finalStatus: "success" },
      isLoading: false,
      error: null,
    })

    await renderPage()

    expect(screen.getByText("Success")).toBeInTheDocument()
  })

  it("shows overdue badge when deadline has passed with no final status", async () => {
    mockUseHeist.mockReturnValue({
      heist: { ...mockHeist, deadline: new Date(2020, 0, 1) },
      isLoading: false,
      error: null,
    })
    mockUseTimeRemaining.mockReturnValue({
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      label: "Time's up",
    })

    await renderPage()

    const overdueElements = screen.getAllByText("Overdue")
    expect(overdueElements.length).toBeGreaterThanOrEqual(1)
  })

  it("shows In Progress status for active heist", async () => {
    await renderPage()

    expect(screen.getByText("In Progress")).toBeInTheDocument()
  })
})
