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

import { ExpiredHeistCard } from "@/components/ExpiredHeistCard"

const mockHeist: Heist = {
  id: "expired1",
  title: "Steal the stapler",
  description: "Take the red stapler from Milton",
  createdBy: "user1",
  createdByCodename: "Agent Fox",
  assignedTo: "user2",
  assignedToCodename: "Agent Wolf",
  deadline: new Date(2026, 2, 1),
  finalStatus: "failure",
  createdAt: new Date(2026, 1, 25),
}

describe("ExpiredHeistCard", () => {
  it("renders title as a link with correct href", () => {
    render(<ExpiredHeistCard heist={mockHeist} />)

    const link = screen.getByRole("link", { name: "Steal the stapler" })
    expect(link).toHaveAttribute("href", "/heists/expired1")
  })

  it("renders FAILED badge for failure status", () => {
    render(<ExpiredHeistCard heist={mockHeist} />)

    expect(screen.getByText("FAILED")).toBeInTheDocument()
  })

  it("renders SUCCESS badge for success status", () => {
    const successHeist: Heist = { ...mockHeist, finalStatus: "success" }
    render(<ExpiredHeistCard heist={successHeist} />)

    expect(screen.getByText("SUCCESS")).toBeInTheDocument()
  })

  it("displays assignee and creator codenames", () => {
    render(<ExpiredHeistCard heist={mockHeist} />)

    expect(screen.getByText("Agent Wolf")).toBeInTheDocument()
    expect(screen.getByText("Agent Fox")).toBeInTheDocument()
  })

  it("shows Unassigned when assignedToCodename is empty", () => {
    const unassigned: Heist = { ...mockHeist, assignedToCodename: "" }
    render(<ExpiredHeistCard heist={unassigned} />)

    expect(screen.getByText("Unassigned")).toBeInTheDocument()
  })

  it("shows Unknown when createdByCodename is empty", () => {
    const unknownCreator: Heist = { ...mockHeist, createdByCodename: "" }
    render(<ExpiredHeistCard heist={unknownCreator} />)

    expect(screen.getByText("Unknown")).toBeInTheDocument()
  })

  it("renders formatted deadline date", () => {
    render(<ExpiredHeistCard heist={mockHeist} />)

    expect(screen.getByText("Mar 1, 2026")).toBeInTheDocument()
  })
})
