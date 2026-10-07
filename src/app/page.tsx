import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import CatalogFilters from '@/components/CatalogFilters'

type SP = { cat?: string; q?: string; orden?: string; min?: string; max?: string }

const num = (v?: string) => {
  const n = Number(v)
  return v && Number.isFinite(n) ? n : null
}

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const { cat, q, orden, min, max } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('products').select('*')

  if (cat) query = query.eq('category', cat)
  if (q) query = query.ilike('name', `%${q}%`)
  const minN = num(min), maxN = num(max)
  if (minN !== null) query = query.gte('price', minN)
  if (maxN !== null) query = query.lte('price', maxN)

  if (orden === 'precio_asc') query = query.order('price', { ascending: true })
  else if (orden === 'precio_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: products } = await query
  const total = products?.length ?? 0

  return (
    <main>
      {/* Banner */}
      <section className="bg-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Nueva colección</p>
          <h1 className="font-display mt-4 text-4xl leading-tight md:text-6xl">
            Básicos que duran,<br className="hidden md:block" /> diseño simple.
          </h1>
          <a href="#catalogo"
            className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm text-white transition hover:bg-neutral-800">
            Ver colección
          </a>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl md:text-3xl">Colección</h2>
          <p className="text-sm text-neutral-500">
            {total} {total === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        <Suspense>
          <CatalogFilters />
        </Suspense>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        {!total && (
          <p className="py-16 text-center text-neutral-500">
            No encontramos productos con esos filtros.
          </p>
        )}
      </section>
    </main>
  )
}