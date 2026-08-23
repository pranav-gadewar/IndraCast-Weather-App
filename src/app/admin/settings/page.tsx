"use client";

import { useEffect, useState } from "react";
import { Settings, Sliders, Shield, Save, CheckCircle, HelpCircle, Activity, ToggleLeft, ToggleRight } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "@/lib/systemSettings";

export default function AdminSettingsPage() {
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [refreshRate, setRefreshRate] = useState("15m");
  const [userRegistration, setUserRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const current = await getSystemSettings();
        setTempUnit(current.tempUnit || "C");
        setRefreshRate(current.refreshRate || "15m");
        setUserRegistration(current.userRegistration !== false);
        setMaintenanceMode(current.maintenanceMode === true);
      } catch (err) {
        console.error("Error loading system settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSavedSuccess(false);

      await updateSystemSettings({
        tempUnit,
        refreshRate,
        userRegistration,
        maintenanceMode,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Error saving system settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-500">Retrieving Firestore Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-1/4 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="h-7 w-7 text-amber-500" /> System Configurations
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage global variables, operational modes, permissions, and default telemetry systems.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
          {maintenanceMode && (
            <span className="flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
              Maintenance Active
            </span>
          )}
        </div>
      </div>

      {/* Settings Form Grid Layout */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Default Metrics */}
          <div className="rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-blue-500" /> Default Telemetry Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Temperature Metric <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </label>
                <div className="relative">
                  <select
                    value={tempUnit}
                    onChange={(e) => setTempUnit(e.target.value as "C" | "F")}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3.5 text-sm font-extrabold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none"
                  >
                    <option value="C">Celsius (°C)</option>
                    <option value="F">Fahrenheit (°F)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Automatic Refresh Cycle <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </label>
                <div className="relative">
                  <select
                    value={refreshRate}
                    onChange={(e) => setRefreshRate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3.5 text-sm font-extrabold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none"
                  >
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Access & Firewalls */}
          <div className="rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-6">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" /> Access & Sign-Up Gateways
            </h2>

            <div className="space-y-4">
              {/* Registration Toggle */}
              <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-slate-900 dark:text-white">Allow Public Registrations</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Control registration flow. Disabling this blocks all signup pages.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUserRegistration(!userRegistration)}
                  className="text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
                >
                  {userRegistration ? (
                    <ToggleRight className="h-9 w-9 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-slate-400 dark:text-slate-600" />
                  )}
                </button>
              </div>

              {/* Maintenance Toggle */}
              <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-slate-900 dark:text-white">Emergency Maintenance Mode</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Restricts login access exclusively to Administrators. Regular users see offline status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className="text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
                >
                  {maintenanceMode ? (
                    <ToggleRight className="h-9 w-9 text-amber-500 animate-pulse" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-slate-400 dark:text-slate-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Overview Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900/40 dark:to-slate-950/40 p-6 backdrop-blur-xl shadow-lg space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-blue-500" /> Config Overview
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-400 divide-y divide-slate-200 dark:divide-slate-800/80">
              <div className="pt-0 flex justify-between">
                <span>Default Unit:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {tempUnit === "C" ? "Celsius (°C)" : "Fahrenheit (°F)"}
                </span>
              </div>
              <div className="pt-4 flex justify-between">
                <span>Refresh Interval:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{refreshRate}</span>
              </div>
              <div className="pt-4 flex justify-between">
                <span>Registration Status:</span>
                <span className={`font-extrabold ${userRegistration ? "text-emerald-500" : "text-red-500"}`}>
                  {userRegistration ? "OPEN" : "PAUSED"}
                </span>
              </div>
              <div className="pt-4 flex justify-between">
                <span>Operational Mode:</span>
                <span className={`font-extrabold ${maintenanceMode ? "text-amber-500" : "text-emerald-500"}`}>
                  {maintenanceMode ? "MAINTENANCE" : "ACTIVE"}
                </span>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Settings saved successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Updating System..." : "Apply Config changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
