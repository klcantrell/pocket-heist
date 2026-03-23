import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import LoginForm from "@/components/LoginForm"

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => <a href={href}>{children}</a>,
}))

vi.mock("@/lib/login", () => ({
  loginUser: vi.fn(),
  getLoginErrorMessage: vi.fn((code: string) => {
    if (code === "auth/invalid-credential") return "Invalid email or password"
    return "Something went wrong. Please try again."
  }),
}))

import { loginUser } from "@/lib/login"

const mockLoginUser = vi.mocked(loginUser)

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLoginUser.mockResolvedValue({ user: {} as never })
  })

  it("renders email field, password field, toggle icon, and submit button", () => {
    render(<LoginForm />)

    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(
      screen.getByLabelText("Toggle password visibility"),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
  })

  it("toggles password visibility when the icon is clicked", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText("Password")
    const toggleButton = screen.getByLabelText("Toggle password visibility")

    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("displays success message on successful login", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "secret123")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Login successful!")
    })

    expect(mockLoginUser).toHaveBeenCalledWith("test@example.com", "secret123")
  })

  it("displays error message when login fails", async () => {
    mockLoginUser.mockRejectedValue({ code: "auth/invalid-credential" })
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "wrong")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email or password",
      )
    })
  })

  it("disables submit button while submitting", async () => {
    let resolveLogin: () => void
    mockLoginUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = () => resolve({ user: {} as never })
        }),
    )
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "secret123")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled()

    resolveLogin!()
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Log In" })).toBeEnabled()
    })
  })

  it("clears error message when user edits email", async () => {
    mockLoginUser.mockRejectedValue({ code: "auth/invalid-credential" })
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "wrong")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Email"), "x")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("clears error message when user edits password", async () => {
    mockLoginUser.mockRejectedValue({ code: "auth/invalid-credential" })
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "wrong")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText("Password"), "x")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("has a link to the signup page", () => {
    render(<LoginForm />)

    const link = screen.getByRole("link", { name: "Sign up" })
    expect(link).toHaveAttribute("href", "/signup")
  })
})
