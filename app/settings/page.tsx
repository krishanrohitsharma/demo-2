"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useRouter } from "next/navigation";
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  LogOut,
  ChevronRight,
  Check,
} from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  description,
  action,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: danger ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)" }}>
          <Icon className="w-4 h-4" style={{ color: danger ? "#ef4444" : "#a78bfa" }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: danger ? "#ef4444" : "#e2e8f0" }}>{label}</p>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0"
      style={{
        background: value ? "#6366f1" : "rgba(255,255,255,0.1)",
        height: 22,
        width: 40,
      }}
    >
      <span
        className="absolute top-0.5 rounded-full bg-white transition-transform"
        style={{
          width: 18,
          height: 18,
          left: value ? 20 : 2,
        }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { userName, userEmail, logout } = useFinanceStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    billReminders: true,
    sipReminders: true,
    lowBalance: true,
    monthlySummary: false,
  });
  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Profile */}
      <Section title="Profile">
        <div className="px-5 py-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
              {userName ? userName[0].toUpperCase() : "U"}
            </div>
            <div>
              <p className="font-semibold text-white">{userName || "User"}</p>
              <p className="text-sm text-slate-500">{userEmail || "user@example.com"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Display Name</label>
              <input defaultValue={userName} readOnly
                className="w-full px-3 py-2.5 rounded-xl text-slate-300 text-sm"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Email</label>
              <input defaultValue={userEmail} readOnly
                className="w-full px-3 py-2.5 rounded-xl text-slate-300 text-sm"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            </div>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        {[
          { key: "billReminders", label: "Bill Due Reminders", desc: "Get alerts before credit card bills are due" },
          { key: "sipReminders", label: "SIP Reminders", desc: "Monthly reminders for SIP investments" },
          { key: "lowBalance", label: "Low Balance Alerts", desc: "Alert when account balance drops low" },
          { key: "monthlySummary", label: "Monthly Summary", desc: "Get a monthly finance summary email" },
        ].map(({ key, label, desc }) => (
          <SettingRow
            key={key}
            icon={Bell}
            label={label}
            description={desc}
            action={
              <Toggle
                value={notifications[key as keyof typeof notifications]}
                onChange={(v) => setNotifications({ ...notifications, [key]: v })}
              />
            }
          />
        ))}
      </Section>

      {/* App */}
      <Section title="Application">
        <SettingRow icon={Palette} label="Theme" description="Dark mode (default)" />
        <SettingRow icon={Database} label="Currency" description="Indian Rupee (₹ INR)" />
        <SettingRow icon={Shield} label="Security" description="Token-based authentication" />
      </Section>

      {/* Data */}
      <Section title="Data">
        <SettingRow
          icon={Database}
          label="Export Data"
          description="Download your financial data as CSV"
          action={
            <button className="text-xs text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(99,102,241,0.1)" }}>
              Export
            </button>
          }
        />
      </Section>

      {/* Danger */}
      <Section title="Account">
        <SettingRow
          icon={LogOut}
          label="Sign Out"
          description="Sign out of your WealthFlow account"
          danger
          action={
            <button onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)" }}>
              Sign Out
            </button>
          }
        />
      </Section>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: saved ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, #6366f1, #8b5cf6)", border: saved ? "1px solid rgba(16,185,129,0.3)" : "none" }}>
          {saved ? (
            <><Check className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400">Saved!</span></>
          ) : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
