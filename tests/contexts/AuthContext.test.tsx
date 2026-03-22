import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthProvider, useUser } from "@/contexts/AuthContext"

let authCallback: ((user: unknown) => void) | null = null
const mockUnsubscribe = vi.fn()

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_, callback) => {
    authCallback = callback
    return mockUnsubscribe
  }),
  getAuth: vi.fn(),
}))

vi.mock("@/lib/firebase", () => ({
  auth: {},
}))

function TestConsumer() {
  const { user, isLoading } = useUser()
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="user">{user ? "signed-in" : "signed-out"}</span>
    </div>
  )
}

describe("AuthContext", () => {
  beforeEach(() => {
    authCallback = null
    mockUnsubscribe.mockClear()
  })

  it("throws when useUser is used outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      "useUser must be used within an AuthProvider",
    )
    spy.mockRestore()
  })

  it("starts with isLoading true", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId("loading").textContent).toBe("true")
  })

  it("sets user and isLoading false after auth resolves", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    act(() => {
      authCallback?.({ uid: "123", email: "test@example.com" })
    })

    expect(screen.getByTestId("loading").textContent).toBe("false")
    expect(screen.getByTestId("user").textContent).toBe("signed-in")
  })

  it("updates state when auth state changes", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    act(() => {
      authCallback?.({ uid: "123" })
    })
    expect(screen.getByTestId("user").textContent).toBe("signed-in")

    act(() => {
      authCallback?.(null)
    })
    expect(screen.getByTestId("user").textContent).toBe("signed-out")
  })

  it("unsubscribes on unmount", () => {
    const { unmount } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
