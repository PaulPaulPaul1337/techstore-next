'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface UserRow {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  banned: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) { router.replace('/login'); return; }
    if (!currentUser.isAdmin) { router.replace('/account'); return; }
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [currentUser]);

  async function patchUser(id: string, body: { isAdmin?: boolean; banned?: boolean }) {
    setSavingId(id);
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Помилка оновлення користувача');
    }
    setSavingId(null);
  }

  if (!currentUser?.isAdmin) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">👥 Користувачі</h1>
          <p className="text-(--muted) text-sm mt-1">Управління правами та блокуванням</p>
        </div>
        <Link href="/admin" className="bg-(--bg) border border-(--border) hover:border-(--accent) text-(--text) font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
          ← Панель адміністратора
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Всього користувачів', value: users.length, icon: '👥' },
          { label: 'Адміністратори', value: users.filter((u) => u.isAdmin).length, icon: '⚙️' },
          { label: 'Заблоковані', value: users.filter((u) => u.banned).length, icon: '🚫' },
          { label: 'Активні', value: users.filter((u) => !u.banned).length, icon: '✓' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-(--card) border border-(--border) rounded-xl p-5 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-(--muted) text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-(--card) border border-(--border) rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-(--border) font-bold text-sm text-(--muted) uppercase tracking-wide">
          {loading ? 'Завантаження...' : `Список користувачів (${users.length})`}
        </div>

        {!loading && users.length === 0 ? (
          <div className="text-center py-12 text-(--muted)">Користувачів ще немає</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--bg)">
                  <th className="text-left px-5 py-3 text-[12px] font-semibold text-(--muted)">Користувач</th>
                  <th className="text-left px-5 py-3 text-[12px] font-semibold text-(--muted)">Реєстрація</th>
                  <th className="text-center px-5 py-3 text-[12px] font-semibold text-(--muted)">Роль</th>
                  <th className="text-center px-5 py-3 text-[12px] font-semibold text-(--muted)">Статус</th>
                  <th className="text-center px-5 py-3 text-[12px] font-semibold text-(--muted)">Дії</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser.id;
                  const saving = savingId === user.id;
                  return (
                    <tr key={user.id} className="border-b border-(--border) hover:bg-(--bg) transition-colors">
                      <td className="px-5 py-3">
                        <div className="text-[13px] font-semibold">
                          {user.name} {isSelf && <span className="text-(--muted) text-[11px]">(ви)</span>}
                        </div>
                        <div className="text-[11px] text-(--muted)">{user.email}</div>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-(--muted)">
                        {new Date(user.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${user.isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-(--bg) text-(--muted)'}`}>
                          {user.isAdmin ? 'Адмін' : 'Користувач'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${user.banned ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                          {user.banned ? 'Заблоковано' : 'Активний'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            disabled={isSelf || saving}
                            onClick={() => patchUser(user.id, { isAdmin: !user.isAdmin })}
                            className="text-[11px] text-blue-600 hover:text-blue-800 underline transition-colors disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                          >
                            {user.isAdmin ? 'Прибрати адміна' : 'Зробити адміном'}
                          </button>
                          <button
                            disabled={isSelf || saving}
                            onClick={() => patchUser(user.id, { banned: !user.banned })}
                            className="text-[11px] text-(--accent) hover:opacity-70 underline transition-opacity disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                          >
                            {user.banned ? 'Розблокувати' : 'Заблокувати'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
