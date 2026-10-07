'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES = ['Poleras', 'Pantalones', 'Accesorios', 'Zapatos', 'Chaquetas']

export default function CatalogFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const cat = params.get('cat') ?? ''
  const orden = params.get('orden') ?? 'recientes'
  const [q, setQ] = useState(params.get('q') ?? '')
  const [min, setMin] = useState(params.get('min') ?? '')
  const [max, setMax] = useState(params.get('max') ?? '')

  const active = ['cat', 'q', 'min', 'max', 'orden'].some((k) => params.get(k))

  function go(changes: Record<string, string>) {
    const next = new URLSearchParams(params.toString())
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    const qs = next.toString()
    router.push(qs ? `/?${qs}#catalogo` : '/#catalogo', { scroll: false })
  }

  function apply(e: React.FormEvent) {
    e.preventDefault()
    go({ q: q.trim(), min, max })
  }

  function clear() {
    setQ(''); setMin(''); setMax('')
    router.push('/#catalogo', { scroll: false })
  }

  const input =
    'h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-black'

  return (
    <div className="mb-8 space-y-4">
      {/* Categorías */}
      <nav className="flex gap-6 overflow-x-auto border-b border-neutral-200">
        {['', ...CATEGORIES].map((c) => (
          <button
            key={c || 'todos'}
            onClick={() => go({ cat: c })}
            className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm transition ${
              cat === c
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            {c || 'Todos'}
          </button>
        ))}
      </nav>

      {/* Búsqueda, precio y orden */}
      <form onSubmit={apply} className="flex flex-wrap items-center gap-2">
        <input
          type="search" placeholder="Buscar producto…" value={q}
          onChange={(e) => setQ(e.target.value)}
          className={`${input} min-w-[200px] flex-1`}
        />
        <input
          type="number" min="0" inputMode="numeric" placeholder="Precio mín." value={min}
          onChange={(e) => setMin(e.target.value)} className={`${input} w-28`}
        />
        <input
          type="number" min="0" inputMode="numeric" placeholder="Precio máx." value={max}
          onChange={(e) => setMax(e.target.value)} className={`${input} w-28`}
        />
        <button className="h-10 rounded-md bg-black px-5 text-sm text-white transition hover:bg-neutral-800">
          Aplicar
        </button>
        <select
          value={orden}
          onChange={(e) => go({ orden: e.target.value === 'recientes' ? '' : e.target.value })}
          className={input}
        >
          <option value="recientes">Más recientes</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
        </select>
        {active && (
          <button type="button" onClick={clear} className="text-sm text-neutral-500 underline hover:text-black">
            Limpiar
          </button>
        )}
      </form>
    </div>
  )
}