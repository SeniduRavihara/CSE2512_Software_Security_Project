'use client';

import { updateOrder } from '@/actions/orders';
import { useTransition } from 'react';

export default function OrderStatusSelector({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      await updateOrder(orderId, newStatus);
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-teal-600 sm:text-xs sm:leading-6 bg-transparent ${
        currentStatus === 'PENDING' ? 'text-yellow-400 ring-yellow-400/20 bg-yellow-400/10' :
        currentStatus === 'SHIPPED' ? 'text-blue-400 ring-blue-400/20 bg-blue-400/10' :
        currentStatus === 'DELIVERED' ? 'text-green-400 ring-green-400/20 bg-green-400/10' :
        currentStatus === 'CANCELLED' ? 'text-red-400 ring-red-400/20 bg-red-400/10' :
        'text-gray-400 ring-gray-700'
      }`}
    >
      <option value="PENDING" className="bg-zinc-900 text-yellow-400">PENDING</option>
      <option value="SHIPPED" className="bg-zinc-900 text-blue-400">SHIPPED</option>
      <option value="DELIVERED" className="bg-zinc-900 text-green-400">DELIVERED</option>
      <option value="CANCELLED" className="bg-zinc-900 text-red-400">CANCELLED</option>
    </select>
  );
}
