"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, MapPin, Phone, CheckCircle, Save, KeyRound, ArrowRight } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    role: "admin",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setLoading(false);
        return;
      }

      setUser(firebaseUser);
      try {
        const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            name: data.name || "",
            email: data.email || firebaseUser.email || "",
            phone: data.phone || "",
            city: data.city || "",
            state: data.state || "",
            role: data.role || "admin",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setSavedSuccess(false);

      await updateDoc(doc(db, "users", user.uid), {
        name: form.name,
        phone: form.phone,
        city: form.city,
        state: form.state,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!form.email) return;
    try {
      await sendPasswordResetEmail(auth, form.email);
      setResetEmailSent(true);
      setTimeout(() => setResetEmailSent(false), 4000);
    } catch (err) {
      console.error("Error sending reset email:", err);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-500">Loading Profile Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <User className="h-8 w-8 text-amber-500" /> Admin Account Profile
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
          Verify security credentials, administrative privileges, and contact vectors.
        </p>
      </div>

      {/* Main Glassmorphic Profile Box */}
      <div className="rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-8">
        
        {/* Profile Card Header Block */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-200/50 dark:border-slate-800/80 gap-6">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            {/* Avatar Circle with ambient ring */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 opacity-60 blur group-hover:opacity-100 transition-opacity" />
              <div className="relative h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-white flex items-center justify-center font-black text-3xl border-2 border-slate-200 dark:border-slate-850">
                {form.name?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {form.name || "Administrator"}
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-1">
                <Mail className="h-3.5 w-3.5" /> {form.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1.5">
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Shield className="h-3 w-3" /> System Admin
                </span>
              </div>
            </div>
          </div>

          {/* Reset Link Trigger */}
          <div className="shrink-0 space-y-2">
            <button
              type="button"
              onClick={handleSendResetEmail}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-black text-slate-700 dark:text-slate-300 transition-all active:scale-95 shadow-sm"
            >
              <KeyRound className="h-4 w-4 text-amber-500" />
              Send Password Reset Link
            </button>
            {resetEmailSent && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                Reset link sent to {form.email}!
              </div>
            )}
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Full Display Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm font-extrabold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address (Immutable)
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={form.email}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-sm font-bold text-slate-500 dark:text-slate-550 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Phone Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm font-extrabold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                City / Core Region
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Pune"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm font-extrabold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 shrink-0" />
              Profile updated successfully in Firestore!
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving profile..." : "Save Admin Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
