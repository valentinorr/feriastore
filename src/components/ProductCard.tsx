'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart, Product } from './CartProvider'

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart()
  const count = p.images?.length ?? 1

  return (
    <article className="group">
      <Link href={`/producto/${p.id}`} className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={p.image_url} alt={p.name} fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-contain transition duration-500 group-hover:scale-[1.03]"
        />
        {count > 1 && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] text-neutral-700">
            {count} fotos
          </span>
        )}
      </Link>

      <div className="mt-3 space-y-1">
        <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">{p.category}</p>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/producto/${p.id}`} className="text-sm font-medium leading-snug hover:underline">
            {p.name}
          </Link>
          <p className="whitespace-nowrap text-sm font-medium">${p.price.toLocaleString('es-CL')}</p>
        </div>
        <button
          onClick={() => add(p)}
          className="mt-2 w-full rounded-full border border-black py-2 text-sm transition hover:bg-black hover:text-white"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}