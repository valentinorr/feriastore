export default function Footer() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg uppercase tracking-[0.2em] text-black">Reborn Vill</p>
          <p className="mt-1">Ropa simple, pensada para durar.</p>
        </div>

        {wa && (
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="underline">
            Escríbenos por WhatsApp
          </a>
        )}

        <p className="text-neutral-400">© {new Date().getFullYear()} MI TIENDA</p>
      </div>
    </footer>
  )
}