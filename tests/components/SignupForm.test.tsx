import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import SignupForm from "@/components/SignupForm"

const mockPush = vi.fn()

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => <a href={href}>{children}</a>,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock("@/lib/signup", () => ({
  signUpUser: vi.fn(),
  getSignupErrorMessage: vi.fn((code: string) => {
    if (code === "auth/email-already-in-use")
      return "That email is already registered"
    return "Something went wrong. Please try again."
  }),
}))

import { signUpUser } from "@/lib/signup"

const mockSignUpUser = vi.mocked(signUpUser)

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSignUpUser.mockResolvedValue({
      user: {} as never,
      codename: "SilentFoxDashes",
    })
  })

  it("renders email field, password field, toggle icon, and submit button", () => {
    render(<SignupForm />)

    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(
      screen.getByLabelText("Toggle password visibility"),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument()
  })

  it("toggles password visibility when the icon is clicked", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const passwordInput = screen.getByLabelText("Password")
    const toggleButton = screen.getByLabelText("Toggle password visibility")

    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("calls signUpUser with email and password on submission", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "secret123")
    await user.click(screen.getByRole("button", { name: "Sign Up" }))

    await waitFor(() => {
      expect(mockSignUpUser).toHaveBeenCalledWith(
        "test@example.com",
        "secret123",
      )
    })
  })

  it("redirects to /heists on successful signup", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "secret123")
    await user.click(screen.getByRole("button", { name: "Sign Up" }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists")
    })
  })

  it("displays error message when signup fails", async () => {
    mockSignUpUser.mockRejectedValue({ code: "auth/email-already-in-use" })
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "secret123")
    await user.click(screen.getByRole("button", { name: "Sign Up" }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "That email is already registered",
      )
    })
  })

  it("disables submit button while submitting", async () => {
    let resolveSignup: () => void
    mockSignUpUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignup = () => resolve({ user: {} as never, codename: "Test" })
        }),
    )
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "secret123")
    await user.click(screen.getByRole("button", { name: "Sign Up" }))

    expect(screen.getByRole("button", { name: "Signing up..." })).toBeDisabled()

    resolveSignup!()
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sign Up" })).toBeEnabled()
    })
  })

  it("has a link to the login page", () => {
    render(<SignupForm />)

    const link = screen.getByRole("link", { name: "Log in" })
    expect(link).toHaveAttribute("href", "/login")
  })
})
