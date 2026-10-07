'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type Product = {
  id: string; name: string; description: string
  price: number; category: string; image_url: string
  images: string[]
}
type Item = Product & { qty: number }

const Ctx = createContext<any>(null)
export const useCart = () => useContext(Ctx)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('cart') || '[]')) } catch {}
  }, [])
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)) }, [items])

  const add = (p: Product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id)
      return found
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }]
    })
    setOpen(true)
  }
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <Ctx.Provider value={{ items, add, remove, total, count, open, setOpen }}>
      {children}
    </Ctx.Provider>
  )
}