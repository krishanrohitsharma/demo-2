"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Zap, Eye, EyeOff, TrendingUp, Shield, BarChart2 } from "lucide-react";

const features = [
  { icon: TrendingUp, text: "Track investments & returns" },
  { icon: BarChart2, text: "Visual spending analytics" },
  { icon: Shield, text: "Secure & private by default" },
];

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useFinanceStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const displayName = mode === "signup" ? name : email.split("@")[0];
    login(email, displayName);
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a0f" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">WealthFlow</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Your finances,<br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              beautifully organized.
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Track income, expenses, investments, and net worth — all in one premium dashboard.
          </p>
          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs">
          © 2026 WealthFlow. Your data stays on your device.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">WealthFlow</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">
            {mode === "login" ? "Welcome back" : "Get started free"}
          </h3>
          <p className="text-slate-500 text-sm mb-7">
            {mode === "login"
              ? "Sign in to your WealthFlow account"
              : "Create your WealthFlow account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm text-slate-200 placeholder-slate-600"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="text-right">
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-slate-600" style={{ background: "#0a0a0f" }}>or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "Apple"].map((provider) => (
              <button
                key={provider}
                onClick={() => {
                  setEmail(`demo@${provider.toLowerCase()}.com`);
                  setPassword("demo");
                  setLoading(true);
                  setTimeout(() => {
                    login(`demo@${provider.toLowerCase()}.com`, "Demo User");
                    router.replace("/");
                  }, 600);
                }}
                className="py-2.5 rounded-xl text-sm text-slate-300 hover:text-white font-medium transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
