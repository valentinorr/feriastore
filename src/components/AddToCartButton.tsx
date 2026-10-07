'use client'
import { useCart, Product } from './CartProvider'

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <button
      onClick={() => add(product)}
      className="w-full rounded-full bg-black py-3.5 text-sm text-white transition hover:bg-neutral-800"
    >
      Agregar al carrito
    </button>
  )
}