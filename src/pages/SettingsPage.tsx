import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { IntegrationHealth } from '../types';
import { PixelCrest } from '../components/PixelVisuals';
import {
  User,
  Key,
  Cpu,
  Copy,
  Check,
  Save,
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
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24 space-y-16">
      <div className="border-b border-zinc-800 pb-8 space-y-2">
        <div className="font-pixel text-[11px] text-amber-400 uppercase tracking-widest">
          SYSTEM CONFIGURATION
        </div>
        <h1 className="font-pixel text-2xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight">
          SETTINGS & KEYS
        </h1>
      </div>

      {/* 1. Profile Management */}
      <div className="p-8 sm:p-12 pixel-card space-y-8">
        <div className="space-y-1.5">
          <span className="font-pixel text-[10px] text-amber-400 uppercase tracking-widest">
            PROFILE IDENTIFIER
          </span>
          <h2 className="font-pixel text-base sm:text-lg text-zinc-100 uppercase">DEVELOPER PROFILE</h2>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-pixel text-[10px]">DISPLAY NAME</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-700 bg-black text-zinc-100 focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-pixel text-[10px]">EMAIL (READ-ONLY)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-3 border border-zinc-800 bg-zinc-950 text-zinc-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-pixel text-[10px]">TECHNICAL BIOGRAPHY</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-700 bg-black text-zinc-100 focus:outline-none focus:border-amber-500 transition resize-none font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-zinc-500 uppercase font-mono">ROLE: {user?.role}</span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-3 pixel-btn-primary text-xs cursor-reactive-target"
            >
              {saveSuccess ? 'SAVED' : isSaving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Cryptographic Key Inspector */}
      <div className="p-8 sm:p-12 pixel-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="font-pixel text-[10px] text-amber-400 uppercase tracking-widest">
              CRYPTOGRAPHIC AUTHORITY
            </span>
            <h2 className="font-pixel text-base sm:text-lg text-zinc-100 uppercase">
              Ed25519 PUBLIC VERIFICATION KEY
            </h2>
          </div>
          <span className="font-pixel text-xs text-amber-400">
            {publicKeyInfo?.version || 'v1-ed25519'}
          </span>
        </div>

        <div className="p-5 border border-zinc-800 bg-black space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-500 text-[10px]">
            <span>SPKI PEM FORMAT</span>
            <button
              onClick={copyPublicKey}
              className="text-amber-400 hover:text-amber-300 font-pixel text-[10px]"
            >
              {copiedKey ? 'COPIED' : 'COPY'}
            </button>
          </div>
          <pre className="text-zinc-300 overflow-x-auto p-4 bg-zinc-950 text-[11px] leading-relaxed select-all">
            {publicKeyInfo?.publicKey || 'Loading key...'}
          </pre>
        </div>
      </div>

      {/* 3. Integrations Matrix */}
      <div className="p-8 sm:p-12 pixel-card space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="font-pixel text-[10px] text-amber-400 uppercase tracking-widest">
              SYSTEM MATRIX
            </span>
            <h2 className="font-pixel text-base sm:text-lg text-zinc-100 uppercase">INTEGRATIONS STATUS</h2>
          </div>
          <button
            onClick={loadCryptoAndHealth}
            className="p-2.5 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
            title="Refresh diagnostics"
          >
            <RefreshCw className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {health && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-5 border border-zinc-800 bg-black/60 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-pixel text-zinc-200">GEMINI AI</span>
                <span className="font-pixel text-[10px] text-emerald-400">ACTIVE</span>
              </div>
              <div className="text-[11px] text-zinc-400">MODEL: {health.gemini_ai.model}</div>
            </div>

            <div className="p-5 border border-zinc-800 bg-black/60 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-pixel text-zinc-200">SANDBOX</span>
                <span className="font-pixel text-[10px] text-emerald-400">ACTIVE</span>
              </div>
              <div className="text-[11px] text-zinc-400">RUNTIME: {health.code_execution.provider}</div>
            </div>

            <div className="p-5 border border-zinc-800 bg-black/60 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-pixel text-zinc-200">Ed25519</span>
                <span className="font-pixel text-[10px] text-emerald-400">SECURE</span>
              </div>
              <div className="text-[11px] text-zinc-400">DIGEST: SHA-256 CANONICAL</div>
            </div>

            <div className="p-5 border border-zinc-800 bg-black/60 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-pixel text-zinc-200">PERSISTENCE</span>
                <span className="font-pixel text-[10px] text-emerald-400">ACID</span>
              </div>
              <div className="text-[11px] text-zinc-400">DATABASE: CONNECTED</div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={logout}
          className="px-5 py-2.5 pixel-btn-secondary text-xs text-red-400 hover:text-red-300 flex items-center gap-2 cursor-reactive-target"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>SIGN OUT</span>
        </button>
      </div>
    </div>
  );
};
