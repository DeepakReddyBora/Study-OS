import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Navbar />
      {/* Desktop: offset for sidebar. Mobile: offset for topbar */}
      <main className="flex-1 lg:ml-60 pt-14 lg:pt-0 p-5 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}