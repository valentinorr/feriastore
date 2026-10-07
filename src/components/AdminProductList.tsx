'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Product } from './CartProvider'

export default function AdminProductList({ products }: { products: Product[] }) {
  const supabase = createClient()
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleDelete(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return

    setDeleting(p.id)
    setError('')

    // .select() devuelve las filas borradas; si viene vacío, la política bloqueó la acción
    const { data, error: dbErr } = await supabase
      .from('products')
      .delete()
      .eq('id', p.id)
      .select()

    if (dbErr || !data?.length) {
      setError('No se pudo eliminar: ' + (dbErr?.message ?? 'permiso denegado'))
      setDeleting(null)
      return
    }

    // Borra también la imagen del bucket
   const urls = p.images?.length ? p.images : [p.image_url]
   const paths = urls.map((u) => u.split('/products/').pop()).filter(Boolean) as string[]
   if (paths.length) await supabase.storage.from('products').remove(paths)

    setDeleting(null)
    router.refresh()
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Productos publicados ({products.length})</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {products.length === 0 && <p className="text-sm text-neutral-500">Aún no hay productos.</p>}

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl border bg-white p-2">
            <img src={p.image_url} alt={p.name} className="h-14 w-14 rounded-lg object-contain bg-neutral-100" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-xs text-neutral-500">
                {p.category} · ${p.price.toLocaleString('es-CL')}
              </p>
            </div>
            <Link
              href={`/admin/editar/${p.id}`}
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Editar
            </Link>
            <button
              onClick={() => handleDelete(p)}
              disabled={deleting === p.id}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 disabled:opacity-50"
            >
              {deleting === p.id ? 'Borrando…' : 'Eliminar'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}