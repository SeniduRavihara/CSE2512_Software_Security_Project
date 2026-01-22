import { getProducts } from '@/actions/products';
import AddToCartButton from '@/components/products/AddToCartButton';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30">
      
      {/* Hero Section - Matching SAMPLE Layout */}
      <section className="bg-gradient-to-r from-teal-900/20 to-purple-900/20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Premium Tech at <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Unbeatable Prices</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-lg">
                        Discover the latest laptops, components, and accessories. Compare, bid, and buy with confidence.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <Link href="/products" className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold transition-colors">
                            Explore Now
                        </Link>
                        <Link href="#products-grid" className="px-8 py-3 border border-white/20 hover:bg-white/5 text-white rounded-lg font-medium transition-colors">
                            View Deals
                        </Link>
                    </div>
                </div>
                {/* Abstract Hero Image Placeholder */}
                 <div className="flex-1 flex justify-center relative">
                    <div className="w-full max-w-md aspect-video bg-zinc-900/50 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-2xl shadow-teal-900/20">
                        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-purple-500/10"></div>
                        <span className="text-zinc-700 font-mono text-xl">Future Tech Visual</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Main Content Area - Sidebar + Grid */}
      <section id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters (Static for now to match UI) */}
            <aside className="lg:w-64 flex-shrink-0 hidden lg:block space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                    <div className="space-y-2">
                        {['Laptops', 'Components', 'Accessories', 'Peripherals'].map((cat) => (
                            <div key={cat} className="flex items-center">
                                <input type="checkbox" id={cat} className="rounded border-zinc-700 bg-zinc-900 text-teal-600 focus:ring-teal-500/50" />
                                <label htmlFor={cat} className="ml-2 text-sm text-gray-400 hover:text-white cursor-pointer">{cat}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
                    <div className="space-y-2">
                         <div className="h-1 w-full bg-zinc-800 rounded">
                             <div className="h-1 w-1/2 bg-teal-500 rounded"></div>
                         </div>
                         <div className="flex justify-between text-xs text-gray-500">
                             <span>$0</span>
                             <span>$5000</span>
                         </div>
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">All Products</h2>
                        <p className="text-sm text-gray-400">Showing {products.length} results</p>
                    </div>
                    <select className="bg-zinc-900 border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500/50 outline-none">
                        <option>Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                        <div key={product.id} className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-900/10 transition-all duration-300 group flex flex-col h-full">
                            
                            {/* Card Image Area */}
                            <div className="relative aspect-[4/3] bg-zinc-800 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <button className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors">
                                    <Heart className="w-4 h-4" />
                                </button>
                                {Number(product.price) > 1000 && (
                                    <span className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        PREMIUM
                                    </span>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-2">
                                    <h3 className="font-semibold text-white line-clamp-1 group-hover:text-teal-400 transition-colors">
                                        <Link href={`/products/${product.id}`}>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500">(24)</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 space-y-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-white">${Number(product.price).toLocaleString()}</span>
                                        {Number(product.price) > 0 && (
                                            <span className="text-sm text-gray-500 line-through">${(Number(product.price) * 1.2).toFixed(2)}</span>
                                        )}
                                    </div>
                                    
                                    {/* Use AddToCartButton - but styled to match SAMPLE full width button */}
                                    <div className="w-full">
                                         <AddToCartButton product={{ 
                                           id: product.id, 
                                           name: product.name,
                                           price: Number(product.price),
                                           imageUrl: product.imageUrl
                                         }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/10 mt-20 py-12">
         <div className="max-w-7xl mx-auto px-4 text-center">
             <p className="text-gray-500">© 2024 TechStore. Fully Secure E-Commerce.</p>
         </div>
      </footer>
    </div>
  );
}
