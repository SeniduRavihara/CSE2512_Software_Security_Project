import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <div className="mt-3 text-center sm:mt-5">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Order successful</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Thanks for your purchase! We've received your order and are processing it.
          </p>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <Link
          href="/products"
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
