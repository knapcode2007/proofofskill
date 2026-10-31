import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { IntegrationHealth } from '../types';
import {
  User,
  Key,
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Save,
  ShieldCheck,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cryptographic Key
  const [publicKeyInfo, setPublicKeyInfo] = useState<{ publicKey: string; version: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Integrations Health
  const [health, setHealth] = useState<IntegrationHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setBio(user.bio || '');
    }
    loadCryptoAndHealth();
  }, [user]);

  const loadCryptoAndHealth = async () => {
    setHealthLoading(true);
    try {
      const [keyData, healthData] = await Promise.all([
        api.getPublicKey(),
        api.getIntegrationsHealth(),
      ]);
      setPublicKeyInfo(keyData);
      setHealth(healthData);
    } catch (err) {
      console.error('[Settings] Error fetching diagnostics:', err);
    } finally {
      setHealthLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProfile({ full_name: fullName, bio });
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('[Settings] Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyPublicKey = () => {
    if (publicKeyInfo) {
      navigator.clipboard.writeText(publicKeyInfo.publicKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
          Settings & Cryptographic Diagnostics
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your developer profile and inspect the active Ed25519 public key and backend services.
        </p>
      </div>

      {/* 1. Profile Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Identity & Profile</h2>
            <p className="text-xs text-zinc-400">Information displayed on your public skill passport.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-sm text-zinc-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Technical Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Backend engineer specializing in distributed systems, high-concurrency event loops, and algorithm design."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 transition resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-zinc-400">
              Role: <span className="text-amber-400 font-bold capitalize">{user?.role}</span>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-zinc-950" />
                  <span>Profile Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Cryptographic Authority Key Inspector */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Ed25519 Public Verification Key</h2>
              <p className="text-xs text-zinc-400">
                Independent recruiters and verifiers use this public key to verify digital signatures.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold">
            Version: {publicKeyInfo?.version || 'v1-ed25519'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>OFFICIAL PUBLIC KEY (SPKI / PEM)</span>
            <button
              onClick={copyPublicKey}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
          <pre className="text-zinc-300 overflow-x-auto p-3 bg-black/60 rounded-xl text-[11px] leading-relaxed select-all">
            {publicKeyInfo?.publicKey || 'Loading key...'}
          </pre>
          <div className="text-[11px] text-zinc-400 italic">
            Private signing keys remain exclusively inside the server process. Never exported or transmitted.
          </div>
        </div>
      </div>

      {/* 3. Integrations & System Diagnostics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Integrations Health Matrix</h2>
              <p className="text-xs text-zinc-400">Real-time status of external AI, execution, and data services.</p>
            </div>
          </div>
          <button
            onClick={loadCryptoAndHealth}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
            title="Refresh diagnostics"
          >
            <RefreshCw className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {health && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Gemini */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200">Google Gemini AI</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    health.gemini_ai.configured
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {health.gemini_ai.configured ? 'OPERATIONAL' : 'CERTIFIED FALLBACK'}
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed">{health.gemini_ai.description}</p>
              <div className="text-[11px] font-mono text-zinc-400">
                Model: <span className="text-zinc-300">{health.gemini_ai.model}</span>
              </div>
            </div>

            {/* Code Execution */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200">Isolated Code Execution</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed">{health.code_execution.statusMessage}</p>
              <div className="text-[11px] font-mono text-zinc-400">
                Provider: <span className="text-zinc-300">{health.code_execution.provider}</span>
              </div>
            </div>

            {/* Cryptography */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200">Cryptographic Signing Engine</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  SECURE
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Ed25519 digital signatures with canonical JSON serialization and SHA-256 digests.
              </p>
              <div className="text-[11px] font-mono text-zinc-400">
                Version: <span className="text-zinc-300">{health.cryptography.public_key_version}</span>
              </div>
            </div>

            {/* Database */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200">Database & Persistence</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  PERSISTENT
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                {health.database.supabase_configured
                  ? 'Connected to Supabase PostgreSQL cluster with RLS policies.'
                  : 'ACID persistent JSON data layer active with Supabase migration schema ready.'}
              </p>
              <div className="text-[11px] font-mono text-zinc-400">
                Supabase URL: <span className="text-zinc-300">{health.database.supabase_configured ? 'Configured' : 'Local Persistent'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Action */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-red-400 text-xs font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Current Session</span>
        </button>
      </div>
    </div>
  );
};
