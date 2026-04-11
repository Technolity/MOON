import { FormEvent, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { AdminSession } from '../../admin/adminAuth';
import { getOwnerDefaults } from '../../admin/adminAuth';

interface AdminLoginPageProps {
  session: AdminSession | null;
  onLogin: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  isLoading: boolean;
}

export function AdminLoginPage({ session, onLogin, isLoading }: AdminLoginPageProps) {
  const location = useLocation();
  const defaults = getOwnerDefaults();
  const [email, setEmail] = useState(defaults.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (session) {
    return <Navigate to="/admin/dashboard-overview" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const result = await onLogin(email, password);
    if (!result.ok) {
      setError(result.message ?? 'Invalid owner credentials.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-slate-900/75 border border-slate-800 rounded-2xl p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Admin Access</p>
        <h1 className="mt-2 text-2xl font-['Plus_Jakarta_Sans'] font-bold text-white">Owner Dashboard Login</h1>
        <p className="mt-2 text-sm text-slate-400">Only the store owner can access dashboard-overview, inventory, and analytics-focus layouts.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs uppercase tracking-[0.12em] text-slate-400 mb-2" htmlFor="owner-email">Owner Email</label>
            <input
              id="owner-email"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#5e67aa]"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.12em] text-slate-400 mb-2" htmlFor="owner-password">Owner Password</label>
            <input
              id="owner-password"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#5e67aa]"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-br from-[#454e90] to-[#5e67aa] text-white font-semibold py-3 hover:opacity-95 transition-opacity"
          >
            {isLoading ? 'Signing In...' : 'Enter Admin Dashboard'}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">Current route: {location.pathname}</p>
      </div>
    </main>
  );
}
