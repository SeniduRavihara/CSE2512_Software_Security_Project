import { getProduct } from '@/actions/products';
import AddToCartButton from '@/components/products/AddToCartButton';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      
      {/* Ambient Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-teal-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
          
          {/* Image Gallery */}
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 relative group">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <span className="text-teal-400 font-medium tracking-wider text-sm uppercase">Secure Hardware</span>
            <h1 className="text-4xl font-bold tracking-tight text-white mt-2 mb-4">{product.name}</h1>
            
            <div className="mt-4">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-bold text-white tracking-tight">${Number(product.price).toFixed(2)}</p>
            </div>

            <div className="mt-8">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-400 space-y-6 leading-relaxed">
                <p>{product.description}</p>
                <p>Designed for professionals who demand the highest level of security and performance. meticulously crafted to ensure your data stays safe.</p>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-10">
              <AddToCartButton product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                imageUrl: product.imageUrl
              }} />
              <p className="mt-6 text-center text-sm text-gray-500">
                Free secure shipping on all orders. 30-day money-back guarantee.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
