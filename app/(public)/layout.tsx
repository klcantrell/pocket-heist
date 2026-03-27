import AuthGuard from "@/components/AuthGuard"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="public">
      <AuthGuard mode="requireGuest">{children}</AuthGuard>
    </main>
  )
}
