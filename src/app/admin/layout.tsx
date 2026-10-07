import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/login')

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white px-4 py-3 flex justify-between items-center">
        <span className="font-semibold">Panel de administración</span>
        <form action="/auth/signout" method="post">
          <a href="/" className="text-sm underline">Ver tienda</a>
        </form>
      </header>
      <main className="max-w-xl mx-auto p-4">{children}</main>
    </div>
  )
}