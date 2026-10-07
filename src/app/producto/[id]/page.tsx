import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Gallery from '@/components/Gallery'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: p } = await supabase.from('products').select('*').eq('id', id).single()
  if (!p) notFound()

  const images: string[] = p.images?.length ? p.images : [p.image_url]

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-black">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href={`/?cat=${encodeURIComponent(p.category)}#catalogo`} className="hover:text-black">
          {p.category}
        </Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Gallery images={images} alt={p.name} />

        <div className="space-y-5 md:sticky md:top-24 md:self-start">
          <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">{p.category}</p>
          <h1 className="font-display text-3xl md:text-4xl">{p.name}</h1>
          <p className="text-xl">${Number(p.price).toLocaleString('es-CL')}</p>

          <div className="border-t border-neutral-200 pt-5">
            <p className="whitespace-pre-line leading-relaxed text-neutral-700">{p.description}</p>
          </div>

          <AddToCartButton product={p} />
          <p className="text-xs text-neutral-500">
            Al comprar se abre WhatsApp con tu pedido listo para enviar.
          </p>
        </div>
      </div>
    </main>
  )
}