'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

type State = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    imageUrl?: string[];
  };
  message?: string | null;
};

export default function ProductForm({
  action,
  initialData,
}: {
  action: (state: State, formData: FormData) => Promise<State>;
  initialData?: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
}) {
    const initialState: State = { message: null, errors: {} };
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl mx-auto">
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 md:p-8 shadow-xl">
        
        {/* Product Name */}
        <div className="mb-6">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-400">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={initialData?.name}
            placeholder="e.g. Wireless Noise Cancelling Headphones"
            className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            required
          />
            <div id="name-error" aria-live="polite" aria-atomic="true">
                {state.errors?.name &&
                  state.errors.name.map((error: string) => (
                    <p className="mt-2 text-sm text-red-400" key={error}>
                      {error}
                    </p>
                  ))}
            </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-400">
            Description
          </label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialData?.description}
              placeholder="Detailed product description..."
              rows={4}
              className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              required
            />
            <div id="description-error" aria-live="polite" aria-atomic="true">
                {state.errors?.description &&
                  state.errors.description.map((error: string) => (
                    <p className="mt-2 text-sm text-red-400" key={error}>
                      {error}
                    </p>
                  ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Price */}
            <div>
            <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-400">
                Price ($)
            </label>
                <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={initialData?.price}
                placeholder="0.00"
                className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                required
                />
                <div id="price-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.price &&
                    state.errors.price.map((error: string) => (
                        <p className="mt-2 text-sm text-red-400" key={error}>
                        {error}
                        </p>
                    ))}
                </div>
            </div>

            {/* Image URL */}
            <div>
            <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium text-gray-400">
                Image URL
            </label>
                <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={initialData?.imageUrl}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg bg-black border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                required
                />
                <div id="imageUrl-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.imageUrl &&
                    state.errors.imageUrl.map((error: string) => (
                        <p className="mt-2 text-sm text-red-400" key={error}>
                        {error}
                        </p>
                    ))}
                </div>
            </div>
        </div>
        
        {state.message && (
             <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mb-6">
                {state.message}
            </div>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <Link
            href="/admin/products"
            className="flex h-10 items-center justify-center rounded-lg border border-white/10 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/5 transition-colors"
            >
            Cancel
            </Link>
            <button
            type="submit"
            disabled={isPending}
            className="flex h-10 items-center justify-center rounded-lg bg-teal-600 px-6 text-sm font-bold text-white transition-all hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : (
                'Save Product'
            )}
            </button>
        </div>

      </div>
    </form>
  );
}
