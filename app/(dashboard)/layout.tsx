// components
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AuthGuard from "@/components/AuthGuard"

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard mode="requireAuth">
      <div className="dashboard-layout">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthGuard>
  )
}
