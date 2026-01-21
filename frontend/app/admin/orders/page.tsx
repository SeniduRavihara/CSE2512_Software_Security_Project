import { getOrders } from '@/actions/orders';
import OrderStatusSelector from '@/components/admin/OrderStatusSelector';
import { Package, User } from 'lucide-react';
export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Orders Management</h1>
        <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm text-gray-400">
           Total Orders: <span className="text-white font-bold ml-1">{orders.length}</span>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-sm font-medium text-gray-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Order Details</th>
                <th scope="col" className="px-6 py-4">Customer</th>
                <th scope="col" className="px-6 py-4">Total</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-mono text-gray-400">
                      <Package className="w-4 h-4" />
                      #{order.id.slice(-8)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-medium text-white text-sm">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-teal-400 font-bold">
                      ${Number(order.totalAmount).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32">
                        <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()} <span className="text-gray-600 text-xs ml-1">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
             <div className="text-center py-12 text-gray-500">
                No orders found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
