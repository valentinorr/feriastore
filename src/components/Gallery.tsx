'use client'
import { useState } from 'react'

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0)

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg bg-neutral-100">
        <img src={images[current]} alt={alt} className="aspect-[4/5] w-full object-contain" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src} onClick={() => setCurrent(i)} aria-label={`Ver imagen ${i + 1}`}
              className={`h-20 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100 border-2 transition ${
                i === current ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt={`${alt} ${i + 1}`} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}