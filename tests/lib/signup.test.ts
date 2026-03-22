import { describe, it, expect, vi, beforeEach } from "vitest"
import { signUpUser, getSignupErrorMessage } from "@/lib/signup"

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
}))

vi.mock("@/lib/firebase", () => ({
  auth: { name: "mock-auth" },
  db: { name: "mock-db" },
}))

vi.mock("@/lib/codename", () => ({
  generateCodename: vi.fn(() => "SilentFoxDashes"),
}))

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

const mockCreateUser = vi.mocked(createUserWithEmailAndPassword)
const mockUpdateProfile = vi.mocked(updateProfile)
const mockDoc = vi.mocked(doc)
const mockSetDoc = vi.mocked(setDoc)

describe("signUpUser", () => {
  const fakeUser = { uid: "abc123", email: "test@example.com" }
  const fakeCredential = { user: fakeUser }
  const fakeDocRef = { id: "abc123" }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateUser.mockResolvedValue(fakeCredential as never)
    mockUpdateProfile.mockResolvedValue(undefined as never)
    mockDoc.mockReturnValue(fakeDocRef as never)
    mockSetDoc.mockResolvedValue(undefined as never)
  })

  it("calls createUserWithEmailAndPassword with correct args", async () => {
    await signUpUser("test@example.com", "password123")

    expect(mockCreateUser).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "password123",
    )
  })

  it("sets the generated codename as displayName", async () => {
    await signUpUser("test@example.com", "password123")

    expect(mockUpdateProfile).toHaveBeenCalledWith(fakeUser, {
      displayName: "SilentFoxDashes",
    })
  })

  it("creates a Firestore user doc with only id and codename", async () => {
    await signUpUser("test@example.com", "password123")

    expect(mockDoc).toHaveBeenCalledWith(db, "users", "abc123")
    expect(mockSetDoc).toHaveBeenCalledWith(fakeDocRef, {
      id: "abc123",
      codename: "SilentFoxDashes",
    })
  })

  it("does not store email in the Firestore document", async () => {
    await signUpUser("test@example.com", "password123")

    const docData = mockSetDoc.mock.calls[0][1] as Record<string, unknown>
    expect(docData).not.toHaveProperty("email")
  })

  it("propagates errors from Firebase auth", async () => {
    mockCreateUser.mockRejectedValue(new Error("auth/weak-password"))

    await expect(signUpUser("test@example.com", "short")).rejects.toThrow(
      "auth/weak-password",
    )
  })
})

describe("getSignupErrorMessage", () => {
  it("returns friendly message for email-already-in-use", () => {
    expect(getSignupErrorMessage("auth/email-already-in-use")).toBe(
      "That email is already registered",
    )
  })

  it("returns friendly message for weak-password", () => {
    expect(getSignupErrorMessage("auth/weak-password")).toBe(
      "Password must be at least 6 characters",
    )
  })

  it("returns friendly message for invalid-email", () => {
    expect(getSignupErrorMessage("auth/invalid-email")).toBe(
      "Please enter a valid email address",
    )
  })

  it("returns generic message for unknown error codes", () => {
    expect(getSignupErrorMessage("auth/something-else")).toBe(
      "Something went wrong. Please try again.",
    )
  })
})
