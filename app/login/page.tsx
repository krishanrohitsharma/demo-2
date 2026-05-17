"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Zap, Eye, EyeOff, TrendingUp, Shield, BarChart2 } from "lucide-react";

const features = [
  { icon: TrendingUp, text: "Track investments & returns" },
  { icon: BarChart2, text: "Visual spending analytics" },
  { icon: Shield, text: "Secure & private by default" },
];

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "An account already exists with this email.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || "Something went wrong. Please try again.";
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const { loginWithEmail, signupWithEmail, loginWithGoogle, resetPassword, demoLogin, isFirebase } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "reset") {
        if (isFirebase) {
          await resetPassword(email);
          setResetSent(true);
        }
      } else if (mode === "signup") {
        if (isFirebase) {
          await signupWithEmail(email, password, name || email.split("@")[0]);
        } else {
          demoLogin(email, name || email.split("@")[0]);
        }
        router.replace("/");
      } else {
        if (isFirebase) {
          await loginWithEmail(email, password);
        } else {
          demoLogin(email, email.split("@")[0]);
        }
        router.replace("/");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      setError(getErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      if (isFirebase) {
        await loginWithGoogle();
        router.replace("/");
      } else {
        demoLogin("demo@google.com", "Demo User");
        router.replace("/");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      setError(getErrorMessage(code));
    } finally {
      setLoading(false);
    }
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
        <div>
          {!isFirebase && (
            <div className="mb-3 px-3 py-2 rounded-lg text-xs text-amber-400"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              Running in demo mode — add Firebase config for real auth.
            </div>
          )}
          <p className="text-slate-600 text-xs">© 2026 WealthFlow. Your data stays on your device.</p>
        </div>
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

          {mode === "reset" ? (
            // Forgot password view
            <>
              <h3 className="text-2xl font-bold text-white mb-1">Reset password</h3>
              <p className="text-slate-500 text-sm mb-7">
                {resetSent ? "Check your email for a reset link." : "Enter your email and we'll send a reset link."}
              </p>
              {!resetSent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  </div>
                  {error && <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Sending…" : "Send Reset Link"}
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl text-sm text-emerald-400"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  Reset email sent! Check your inbox.
                </div>
              )}
              <p className="text-center text-sm text-slate-500 mt-6">
                <button onClick={() => { setMode("login"); setResetSent(false); setError(""); }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium">
                  ← Back to sign in
                </button>
              </p>
            </>
          ) : (
            // Login / Signup view
            <>
              <h3 className="text-2xl font-bold text-white mb-1">
                {mode === "login" ? "Welcome back" : "Get started free"}
              </h3>
              <p className="text-slate-500 text-sm mb-7">
                {mode === "login" ? "Sign in to your WealthFlow account" : "Create your WealthFlow account"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)} required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm text-slate-200 placeholder-slate-600"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === "login" && (
                  <div className="text-right">
                    <button type="button" onClick={() => { setMode("reset"); setError(""); }}
                      className="text-xs text-indigo-400 hover:text-indigo-300">
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-400 px-3 py-2 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)" }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
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

              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-slate-500 mt-6">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium">
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
