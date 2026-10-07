'use client'
import Link from 'next/link'
import { useCart } from './CartProvider'

const LINKS = [
  { label: 'Colección', href: '/#catalogo' },
  { label: 'Poleras', href: '/?cat=Poleras#catalogo' },
  { label: 'Pantalones', href: '/?cat=Pantalones#catalogo' },
  { label: 'Accesorios', href: '/?cat=Accesorios#catalogo' },
  { label: 'Zapatos', href: '/?cat=Zapatos#catalogo' },
  { label: 'Chaquetas', href: '/?cat=Chaquetas#catalogo' }
]

export default function Header() {
  const { count, setOpen } = useCart()

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-xl uppercase tracking-[0.2em]">
          Reborn Vill
        </Link>

        <nav className="hidden gap-8 text-sm text-neutral-600 md:flex">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="transition hover:text-black">
              {l.label}
            </Link>
          ))}
        </nav>

        <button onClick={() => setOpen(true)} aria-label="Abrir carrito" className="relative p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 7h12l1 13H5L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}