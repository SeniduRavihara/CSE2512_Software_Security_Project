import { deleteProduct, getProducts } from '@/actions/products';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Products Management</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/20"
        >
          <span className="hidden md:block">Add New Product</span>
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-sm font-medium text-gray-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Product</th>
                <th scope="col" className="px-6 py-4">Description</th>
                <th scope="col" className="px-6 py-4">Price</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-black border border-white/10 overflow-hidden flex-shrink-0">
                         {product.imageUrl && (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                         )}
                      </div>
                      <div className="font-medium text-white">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-400 line-clamp-1 max-w-xs" title={product.description}>
                      {product.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-teal-400 font-mono font-medium">
                      ${Number(product.price).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <form action={async () => {
                          'use server';
                          await deleteProduct(product.id);
                      }}>
                          <button className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-5 h-5" />
                          </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
             <div className="text-center py-12 text-gray-500">
                No products found. Start by creating one!
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
