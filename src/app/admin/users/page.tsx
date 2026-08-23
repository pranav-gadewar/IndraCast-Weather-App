"use client";

import { useEffect, useState } from "react";
import { Users, Search, UserCheck, Trash2, ShieldCheck } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  city?: string;
  state?: string;
  phone?: string;
  gender?: string;
  age?: string;
  createdAt?: unknown;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setPermissionDenied(false);

      const snapshot = await getDocs(collection(db, "users"));
      const fetched: UserProfile[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });

      // Show regular users (role !== 'admin')
      setUsers(fetched.filter((u) => u.role !== "admin"));
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (errorObj.code === "permission-denied" || errorObj.message?.includes("permissions")) {
        setPermissionDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      fetchUsers();
    });

    return () => unsub();
  }, []);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setActionMessage(`Updated role for user to ${newRole.toUpperCase()}.`);
      setTimeout(() => setActionMessage(""), 3500);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user metadata for "${name}"?`)) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      setActionMessage(`User account metadata deleted.`);
      setTimeout(() => setActionMessage(""), 3500);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user doc:", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.city && u.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-7 w-7 text-blue-500" /> Active Users Directory
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real-time user management & Firestore role management engine.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> {actionMessage}
        </div>
      )}

      {/* USER LIST CONTAINER */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 md:p-6 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-amber-500" /> Regular User Accounts
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {filteredUsers.length} User{filteredUsers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm font-medium">
            Loading active user accounts...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm font-medium">
            {permissionDenied
              ? "User directory read permissions restricted by Firestore Security Rules."
              : "No matching regular users found."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs md:text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 sticky top-0 backdrop-blur">
                <tr>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                      {u.name || "N/A"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                      {u.email || "N/A"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                      {u.city ? `${u.city}${u.state ? `, ${u.state}` : ""}` : "India"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                      {u.phone || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                        {u.role || "USER"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role || "user")}
                        className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors"
                        title="Promote User to Admin"
                      >
                        Make Admin
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name || "User")}
                        className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors inline-flex items-center"
                        title="Delete User Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
