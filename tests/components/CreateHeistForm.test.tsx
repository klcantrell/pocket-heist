import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import CreateHeistForm from "@/components/CreateHeistForm"

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock("@/contexts/AuthContext", () => ({
  useUser: () => ({
    user: { uid: "user1", displayName: "SilentFox" },
    isLoading: false,
    logout: vi.fn(),
  }),
}))

vi.mock("@/lib/users", () => ({
  fetchUsers: vi.fn(),
}))

vi.mock("@/lib/heist", () => ({
  createHeist: vi.fn(),
}))

vi.mock("firebase/firestore", () => ({
  serverTimestamp: vi.fn(() => ({ _sentinel: "serverTimestamp" })),
}))

import { fetchUsers } from "@/lib/users"
import { createHeist } from "@/lib/heist"

const mockFetchUsers = vi.mocked(fetchUsers)
const mockCreateHeist = vi.mocked(createHeist)

const testUsers = [
  { id: "user2", codename: "BoldEagle" },
  { id: "user3", codename: "SwiftPanther" },
]

describe("CreateHeistForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchUsers.mockResolvedValue(testUsers)
    mockCreateHeist.mockResolvedValue("new-heist-id")
  })

  it("renders title, description, and assign-to fields", async () => {
    render(<CreateHeistForm />)

    expect(screen.getByLabelText("Title")).toBeInTheDocument()
    expect(screen.getByLabelText("Description")).toBeInTheDocument()
    expect(screen.getByLabelText("Assign To")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Plan the Heist" }),
    ).toBeInTheDocument()
  })

  it("populates assign-to dropdown with user codenames after loading", async () => {
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "BoldEagle" }),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByRole("option", { name: "SwiftPanther" }),
    ).toBeInTheDocument()
  })

  it("excludes the current user from the assign-to dropdown", async () => {
    mockFetchUsers.mockResolvedValue([
      { id: "user1", codename: "SilentFox" },
      ...testUsers,
    ])
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "BoldEagle" }),
      ).toBeInTheDocument()
    })
    expect(
      screen.queryByRole("option", { name: "SilentFox" }),
    ).not.toBeInTheDocument()
  })

  it("shows loading state while fetching users", () => {
    mockFetchUsers.mockReturnValue(new Promise(() => {}))
    render(<CreateHeistForm />)

    expect(
      screen.getByRole("option", { name: "Loading agents..." }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Plan the Heist" }),
    ).toBeDisabled()
  })

  it("calls createHeist with correct input on form submission", async () => {
    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "BoldEagle" }),
      ).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Title"), "Steal the stapler")
    await user.type(
      screen.getByLabelText("Description"),
      "Take the red stapler",
    )
    await user.selectOptions(screen.getByLabelText("Assign To"), "user2")
    await user.click(screen.getByRole("button", { name: "Plan the Heist" }))

    await waitFor(() => {
      expect(mockCreateHeist).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Steal the stapler",
          description: "Take the red stapler",
          createdBy: "user1",
          createdByCodename: "SilentFox",
          assignedTo: "user2",
          assignedToCodename: "BoldEagle",
          finalStatus: null,
          createdAt: { _sentinel: "serverTimestamp" },
        }),
      )
    })

    const input = mockCreateHeist.mock.calls[0][0]
    expect(input.deadline).toBeInstanceOf(Date)
  })

  it("redirects to /heists on successful creation", async () => {
    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "BoldEagle" }),
      ).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Title"), "Test heist")
    await user.type(screen.getByLabelText("Description"), "Test description")
    await user.selectOptions(screen.getByLabelText("Assign To"), "user2")
    await user.click(screen.getByRole("button", { name: "Plan the Heist" }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists")
    })
  })

  it("displays error when createHeist fails", async () => {
    mockCreateHeist.mockRejectedValue(new Error("permission-denied"))
    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "BoldEagle" }),
      ).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Title"), "Test heist")
    await user.type(screen.getByLabelText("Description"), "Test description")
    await user.selectOptions(screen.getByLabelText("Assign To"), "user2")
    await user.click(screen.getByRole("button", { name: "Plan the Heist" }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to create heist. Please try again.",
      )
    })
  })

  it("disables submit button while submitting", async () => {
    let resolveCreate: (value: string) => void
    mockCreateHeist.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve
        }),
    )
    const user = userEvent.setup()
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "BoldEagle" }),
      ).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Title"), "Test heist")
    await user.type(screen.getByLabelText("Description"), "Test description")
    await user.selectOptions(screen.getByLabelText("Assign To"), "user2")
    await user.click(screen.getByRole("button", { name: "Plan the Heist" }))

    expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled()

    resolveCreate!("new-id")
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists")
    })
  })

  it("displays error when fetching users fails", async () => {
    mockFetchUsers.mockRejectedValue(new Error("network error"))
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to load agents. Please refresh the page.",
      )
    })
  })
})
