import { getUsers } from '@/actions/users';
import { Calendar, Shield, ShieldAlert, User } from 'lucide-react';
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Users Management</h1>
        <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm text-gray-400">
           Total Users: <span className="text-white font-bold ml-1">{users.length}</span>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/5 text-sm font-medium text-gray-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Full Name</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Role</th>
                <th scope="col" className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="font-medium text-white">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role === 'ADMIN' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
             <div className="text-center py-12 text-gray-500">
                No users found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
