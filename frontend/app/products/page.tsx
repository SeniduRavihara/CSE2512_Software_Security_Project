import { getProducts } from '@/actions/products';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 pt-20">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-teal-900/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
            <div>
                <h2 className="text-4xl font-bold tracking-tight mb-2">Exclusive <span className="text-teal-500">Collection</span></h2>
                <p className="text-gray-400">Secure hardware and digital assets for the modern professional.</p>
            </div>
            <span className="text-sm text-gray-500 mt-4 md:mt-0">{products.length} Products Available</span>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product: any) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group relative">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 group-hover:border-teal-500/50 transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                     <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-teal-400 transition-colors">
                        {product.name}
                     </h3>
                     <div className="flex justify-between items-center mt-2">
                        <p className="text-teal-400 font-mono font-bold">${Number(product.price).toFixed(2)}</p>
                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 bg-white/10 px-2 py-1 rounded">
                            View
                        </span>
                     </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
