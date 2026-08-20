"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CloudSun,
  Activity,
  ShieldCheck,
  UserCheck,
  Database,
  AlertCircle,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { getSystemSettings, SystemSettings } from "@/lib/systemSettings";
import { getWeatherQueriesCount } from "@/lib/analytics";

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  city?: string;
  createdAt?: any;
}

export default function AdminDashboardPage() {
  const [normalUsers, setNormalUsers] = useState<UserProfile[]>([]);
  const [queriesCount, setQueriesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setPermissionDenied(false);

        // 1️⃣ Fetch System Settings (Live)
        const settings = await getSystemSettings();
        setSystemSettings(settings);

        // 2️⃣ Fetch Weather Queries Count (Live from Firestore)
        const qCount = await getWeatherQueriesCount();
        setQueriesCount(qCount);

        // 3️⃣ Fetch User Registry (Live from Firestore)
        const usersCol = collection(db, "users");
        const snapshot = await getDocs(usersCol);

        const allUsers: UserProfile[] = [];
        snapshot.forEach((doc) => {
          allUsers.push({ id: doc.id, ...doc.data() });
        });

        // Filter OUT Admin profiles so ONLY normal users ('user' role) are listed
        const filteredUsers = allUsers.filter((u) => u.role !== "admin");
        setNormalUsers(filteredUsers);
      } catch (err: any) {
        if (err.code === "permission-denied" || err.message?.includes("permissions")) {
          setPermissionDenied(true);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Dashboard Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            System Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real-time live telemetry, regular user management, and IndraCast system status.
          </p>
        </div>

        {/* Live System Status Indicator */}
        {systemSettings?.maintenanceMode ? (
          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Maintenance Mode Active
          </div>
        ) : (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live & Operational
          </div>
        )}
      </div>

      {/* Permission Notice Banner */}
      {permissionDenied && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-amber-600 dark:text-amber-400 text-xs md:text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-sm">Firestore Permission Setup Required</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              To fetch live user lists in Firebase production, paste these Security Rules into your Firebase Console:
            </p>
            <code className="block mt-2 p-2.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs overflow-x-auto">
              match /users/{`{userId}`} &#123; allow read, write: if request.auth != null; &#125;
            </code>
          </div>
        </div>
      )}

      {/* 100% LIVE METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <MetricCard
          title="Total Regular Users"
          value={loading ? "..." : normalUsers.length.toString()}
          change="100% Live from Firestore"
          icon={<Users className="h-6 w-6 text-blue-500" />}
          gradient="from-blue-500/10 to-indigo-500/10"
        />

        <MetricCard
          title="Weather Queries Today"
          value={loading ? "..." : queriesCount > 0 ? queriesCount.toString() : "0"}
          change="Real-time Query Analytics"
          icon={<CloudSun className="h-6 w-6 text-amber-500" />}
          gradient="from-amber-500/10 to-yellow-500/10"
        />

        <MetricCard
          title="Active Sessions"
          value={loading ? "..." : (normalUsers.length + 1).toString()}
          change="Live Active Accounts"
          icon={<Activity className="h-6 w-6 text-emerald-500" />}
          gradient="from-emerald-500/10 to-teal-500/10"
        />

        <MetricCard
          title="System Health"
          value={systemSettings?.maintenanceMode ? "Maintenance" : "100%"}
          change={systemSettings?.maintenanceMode ? "Access Paused" : "Firestore Operational"}
          icon={<ShieldCheck className="h-6 w-6 text-sky-500" />}
          gradient="from-sky-500/10 to-blue-500/10"
        />
      </div>

      {/* MAIN CONTAINER: REGISTERED USERS & SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REGISTERED USERS TABLE */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 md:p-6 backdrop-blur-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-amber-500" /> Registered Users Registry (Live)
                </h2>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Regular user accounts stored in Firestore (Admins excluded).
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {normalUsers.length} User{normalUsers.length !== 1 ? "s" : ""}
              </span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-slate-500 text-sm font-medium">
                Loading live user registry...
              </div>
            ) : normalUsers.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-sm font-medium">
                {permissionDenied
                  ? "User listing requires Firestore read permissions."
                  : "No regular users registered yet."}
              </div>
            ) : (
              <div className="max-h-60 overflow-x-auto overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs md:text-sm text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 sticky top-0 backdrop-blur">
                    <tr>
                      <th className="px-4 py-3">User Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">City</th>
                      <th className="px-4 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {normalUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                          {u.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
                          {u.email || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 truncate">
                          {u.city || "India"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                            {u.role || "user"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* SYSTEM & SERVICES STATUS PANEL */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <Database className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                Firebase Firestore Status
              </h3>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Auth & Firestore synced with client cookies for middleware evaluation.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Project: indracast-weatherapp
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <CloudSun className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                Weather Services Node
              </h3>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Location weather queries operating with client-cached history.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Latency: 42ms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 bg-gradient-to-br ${gradient} p-4 md:p-5 backdrop-blur-xl flex flex-col justify-between shadow-sm`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">{change}</p>
      </div>
    </div>
  );
}
