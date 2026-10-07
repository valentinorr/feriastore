import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/ProductForm'
import AdminProductList from '@/components/AdminProductList'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10">
      <ProductForm />
      <AdminProductList products={products ?? []} />
    </div>
  )
}