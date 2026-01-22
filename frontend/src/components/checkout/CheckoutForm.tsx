'use client';

import { placeOrder } from '@/actions/orders';
import { useActionState } from 'react';

type CartItem = {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    imageUrl: string;
  };
};

export default function CheckoutForm({ cartItems, subtotal }: { cartItems: CartItem[], subtotal: number }) {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(placeOrder, { message: null, errors: {} });

  return (
    <form action={formAction} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
      <div>
        {state?.message && (
            <div className="mb-4 rounded-md bg-red-900/20 border border-red-900 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-400">{state.message}</h3>
                    </div>
                </div>
            </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Contact information</h2>

          <div className="mt-4">
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                autoComplete="email"
                required
                className="block w-full rounded-lg border-white/10 bg-zinc-900 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3"
              />
            </div>
             <div id="customerEmail-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.customerEmail &&
                  state.errors.customerEmail.map((error: string) => (
                    <p className="mt-2 text-sm text-red-400" key={error}>
                      {error}
                    </p>
                  ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-10">
          <h2 className="text-xl font-bold text-white mb-6">Shipping information</h2>

          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div className="sm:col-span-2">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  autoComplete="name"
                  required
                  className="block w-full rounded-lg border-white/10 bg-zinc-900 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3"
                />
              </div>
               <div id="customerName-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.customerName &&
                  state.errors.customerName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-400" key={error}>
                      {error}
                    </p>
                  ))}
            </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-300">
                Address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="customerAddress"
                  id="customerAddress"
                  autoComplete="street-address"
                  required
                  className="block w-full rounded-lg border-white/10 bg-zinc-900 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3"
                />
              </div>
               <div id="customerAddress-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.customerAddress &&
                  state.errors.customerAddress.map((error: string) => (
                    <p className="mt-2 text-sm text-red-400" key={error}>
                      {error}
                    </p>
                  ))}
            </div>
            </div>
          </div>
        </div>
         
         {/* Payment Placeholder */}
        <div className="mt-10 border-t border-white/10 pt-10">
          <h2 className="text-xl font-bold text-white mb-6">Payment</h2>
           <div className="mt-4 p-4 bg-zinc-900 rounded-lg border border-white/5">
                <p className="text-sm text-gray-400">Payment integration is simulated for this demo. No actual charge will be made.</p>
           </div>
        </div>

      </div>

      {/* Order summary */}
      <div className="mt-10 lg:mt-0">
        <h2 className="text-xl font-bold text-white mb-6">Order summary</h2>

        <div className="mt-4 rounded-xl border border-white/10 bg-zinc-900/50 shadow-sm backdrop-blur-sm">
          <h3 className="sr-only">Items in your cart</h3>
          <ul role="list" className="divide-y divide-white/10">
            {cartItems.map((item) => (
              <li key={item.id} className="flex px-4 py-6 sm:px-6">
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 rounded-md object-cover bg-zinc-800"
                  />
                </div>

                <div className="ml-6 flex flex-1 flex-col">
                  <div className="flex">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm">
                        <a href="#" className="font-medium text-white hover:text-teal-400 transition-colors">
                          {item.product.name}
                        </a>
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-1 items-end justify-between pt-2">
                    <p className="mt-1 text-sm font-bold text-teal-400">${Number(item.product.price).toFixed(2)}</p>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <dl className="space-y-6 border-t border-white/10 px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between">
              <dt className="text-base font-medium text-gray-300">Total</dt>
              <dd className="text-xl font-bold text-white">${subtotal.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="border-t border-white/10 px-4 py-6 sm:px-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg border border-transparent bg-teal-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-teal-900/20 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:bg-teal-800 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {isPending ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
