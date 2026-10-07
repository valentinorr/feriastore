'use client'
import { useCart } from './CartProvider'

export default function CartDrawer() {
  const { items, remove, total, open, setOpen } = useCart()
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  const message = [
    'Hola! Quiero hacer el siguiente pedido:',
    '',
    ...items.map(
      (i: any) => `• ${i.qty} × ${i.name} — $${(i.price * i.qty).toLocaleString('es-CL')}`
    ),
    '',
    `Total: $${total.toLocaleString('es-CL')}`,
  ].join('\n')

  const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />}
      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Tu carrito</h2>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>
        <ul className="flex-1 space-y-3 overflow-y-auto p-4">
          {items.length === 0 && <p className="text-neutral-500">Tu carrito está vacío</p>}
          {items.map((i: any) => (
            <li key={i.id} className="flex gap-3">
              <img src={i.image_url} alt={i.name} className="h-16 w-16 rounded object-contain bg-neutral-100" />
              <div className="flex-1">
                <p className="text-sm font-medium">{i.name}</p>
                <p className="text-sm text-neutral-500">{i.qty} × ${i.price.toLocaleString('es-CL')}</p>
              </div>
              <button onClick={() => remove(i.id)} className="text-sm text-red-600">Quitar</button>
            </li>
          ))}
        </ul>
          {items.length > 0 ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-green-600 py-3 text-center text-white"
            >
              Comprar por WhatsApp
            </a>
          ) : (
            <button disabled className="w-full rounded-lg bg-neutral-300 py-3 text-white">
              Comprar por WhatsApp
            </button>
          )}
        </aside>
      </>
    )
}