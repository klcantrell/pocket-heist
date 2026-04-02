import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import type { Heist } from "@/types/firestore"

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={href as string} {...props}>
      {children}
    </a>
  ),
}))

import { HeistCard, HeistCardSkeleton } from "@/components/HeistCard"

const mockHeist: Heist = {
  id: "abc123",
  title: "Steal the stapler",
  description: "Take the red stapler from Milton",
  createdBy: "user1",
  createdByCodename: "Agent Fox",
  assignedTo: "user2",
  assignedToCodename: "Agent Wolf",
  deadline: new Date("2099-04-05"),
  finalStatus: null,
  createdAt: new Date("2026-03-30"),
}

describe("HeistCard", () => {
  it("renders heist title as a link to the detail page", () => {
    render(<HeistCard heist={mockHeist} />)

    const link = screen.getByRole("link", { name: "Steal the stapler" })
    expect(link).toHaveAttribute("href", "/heists/abc123")
  })

  it("renders assignee and creator codenames", () => {
    render(<HeistCard heist={mockHeist} />)

    expect(screen.getByText("Agent Wolf")).toBeInTheDocument()
    expect(screen.getByText("Agent Fox")).toBeInTheDocument()
  })

  it("shows overdue indicator when deadline is past and finalStatus is null", () => {
    const overdueHeist: Heist = {
      ...mockHeist,
      deadline: new Date("2020-01-01"),
    }
    render(<HeistCard heist={overdueHeist} />)

    expect(screen.getByText("Overdue")).toBeInTheDocument()
  })

  it("does not show overdue when finalStatus is set", () => {
    const completedHeist: Heist = {
      ...mockHeist,
      deadline: new Date("2020-01-01"),
      finalStatus: "success",
    }
    render(<HeistCard heist={completedHeist} />)

    expect(screen.queryByText("Overdue")).not.toBeInTheDocument()
  })

  it("does not show overdue when deadline is in the future", () => {
    render(<HeistCard heist={mockHeist} />)

    expect(screen.queryByText("Overdue")).not.toBeInTheDocument()
  })
})

describe("HeistCardSkeleton", () => {
  it("renders without errors", () => {
    const { container } = render(<HeistCardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
