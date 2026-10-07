'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Product } from './CartProvider'

const CATEGORIES = ['Poleras', 'Pantalones', 'Accesorios', 'Zapatos', 'Chaquetas']
const MAX_IMAGES = 6

async function compressImage(file: File, maxSize = 1600, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('No se pudo comprimir la imagen'))),
      'image/jpeg',
      quality
    )
  )
}

// Una imagen ya guardada tiene `url`; una recién elegida tiene `file`
type Pic = { key: string; src: string; file?: File; url?: string }

const pathFromUrl = (u: string) => u.split('/products/').pop() as string

export default function ProductForm({ product }: { product?: Product }) {
  const editing = !!product
  const supabase = createClient()
  const router = useRouter()

  const initialUrls = product
    ? product.images?.length ? product.images : [product.image_url]
    : []

  const [pics, setPics] = useState<Pic[]>(
    initialUrls.map((u) => ({ key: u, src: u, url: u }))
  )
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [category, setCategory] = useState(product?.category ?? CATEGORIES[0])
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const categories = CATEGORIES.includes(category) ? CATEGORIES : [...CATEGORIES, category]

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    const room = MAX_IMAGES - pics.length
    const added = selected.slice(0, room).map((file) => {
      const preview = URL.createObjectURL(file)
      return { key: preview, src: preview, file }
    })
    setPics((prev) => [...prev, ...added])
    e.target.value = ''
  }

  function removePic(i: number) {
    if (pics[i].file) URL.revokeObjectURL(pics[i].src)
    setPics((prev) => prev.filter((_, idx) => idx !== i))
  }

  function makeCover(i: number) {
    setPics((prev) => {
      const copy = [...prev]
      const [pic] = copy.splice(i, 1)
      return [pic, ...copy]
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pics.length === 0) return setStatus({ type: 'error', msg: 'Debe quedar al menos una imagen' })

    setLoading(true)
    setStatus(null)
    const uploadedPaths: string[] = []

    try {
      // 1. Subir solo las imágenes nuevas
      const finalUrls: string[] = []
      for (const pic of pics) {
        if (pic.url) {
          finalUrls.push(pic.url) // ya estaba guardada
          continue
        }
        const file = await compressImage(pic.file!)
        const path = `${crypto.randomUUID()}.jpg`
        const { error } = await supabase.storage
          .from('products')
          .upload(path, file, { contentType: 'image/jpeg' })
      }

      const values = {
        name,
        description,
        price: parseFloat(price),
        category,
        image_url: finalUrls[0],
        images: finalUrls,
      }

      if (editing) {
        // 2a. Actualizar. .select() permite detectar si la política bloqueó el cambio
        const { data, error } = await supabase
          .from('products').update(values).eq('id', product!.id).select()
        if (error) throw error
        if (!data?.length) throw new Error('permiso denegado')

        // 3a. Borrar del bucket las imágenes que ya no se usan
        const removed = initialUrls.filter((u) => !finalUrls.includes(u)).map(pathFromUrl)
        if (removed.length) await supabase.storage.from('products').remove(removed)

        router.push('/admin')
        router.refresh()
      } else {
        // 2b. Crear
        const { error } = await supabase.from('products').insert(values)
        if (error) throw error

        setStatus({ type: 'ok', msg: 'Producto publicado ✅' })
        pics.forEach((p) => p.file && URL.revokeObjectURL(p.src))
        setPics([]); setName(''); setDescription(''); setPrice('')
        router.refresh()
      }
    } catch (err: any) {
      // Si algo falló, limpia lo recién subido para no dejar imágenes huérfanas
      if (uploadedPaths.length) await supabase.storage.from('products').remove(uploadedPaths)
      setStatus({ type: 'error', msg: 'Error al guardar: ' + (err?.message ?? 'desconocido') })
    } finally {
      setLoading(false)
    }
  }

  const input = 'w-full rounded-lg border bg-white px-3 py-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-semibold">{editing ? 'Editar producto' : 'Nuevo producto'}</h1>

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {pics.map((pic, i) => (
            <div key={pic.key} className="relative aspect-square overflow-hidden rounded-lg border bg-white">
              <img src={pic.src} alt={`Imagen ${i + 1}`} className="h-full w-full object-contain bg-neutral-100" />
              {i === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-black px-1.5 py-0.5 text-[10px] text-white">
                  Portada
                </span>
              ) : (
                <button type="button" onClick={() => makeCover(i)}
                  className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px]">
                  Hacer portada
                </button>
              )}
              <button type="button" onClick={() => removePic(i)} aria-label="Quitar imagen"
                className="absolute right-1 top-1 h-6 w-6 rounded-full bg-white/90 text-sm leading-6">
                ✕
              </button>
            </div>
          ))}

          {pics.length < MAX_IMAGES && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white text-center text-xs text-neutral-500">
              <span className="text-2xl">＋</span>
              Agregar fotos
              <input type="file" accept="image/*" multiple onChange={onFilesChange} className="hidden" />
            </label>
          )}
        </div>
        <p className="text-xs text-neutral-500">
          {pics.length}/{MAX_IMAGES} imágenes. La primera es la portada.
        </p>
      </div>

      <input required className={input} placeholder="Nombre del producto"
        value={name} onChange={(e) => setName(e.target.value)} />

      <textarea required rows={3} className={input} placeholder="Descripción"
        value={description} onChange={(e) => setDescription(e.target.value)} />

      <input required type="number" min="0" step="0.01" className={input} placeholder="Precio"
        value={price} onChange={(e) => setPrice(e.target.value)} />

      <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>

      {status && (
        <p className={status.type === 'ok' ? 'text-green-600' : 'text-red-600'}>{status.msg}</p>
      )}

      <div className="flex gap-2">
        {editing && (
          <Link href="/admin" className="rounded-lg border px-4 py-3 text-center">Cancelar</Link>
        )}
        <button disabled={loading}
          className="flex-1 rounded-lg bg-black py-3 text-white disabled:opacity-50">
          {loading ? 'Guardando…' : editing ? 'Guardar cambios' : 'Publicar producto'}
        </button>
      </div>
    </form>
  )
}