"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Lock, User as UserIcon } from "lucide-react";
import { apiRequest, getStoredToken, setStoredToken, type AuthResponse } from "@/lib/api";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "login" ? "login" : "register";

  const [authMode, setAuthMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "login" || mode === "register") {
      setAuthMode(mode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      if (authMode === "register") {
        const res = await apiRequest<AuthResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            registration_number: regNumber || undefined,
            phone: phone || undefined,
          }),
        });
        setStoredToken(res.access_token);
        setStatusMessage({
          type: "success",
          text: "Account registered successfully! Redirecting to festival passes...",
        });
        setTimeout(() => router.push("/tickets"), 1200);
      } else {
        const res = await apiRequest<AuthResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setStoredToken(res.access_token);
        setStatusMessage({
          type: "success",
          text: `Welcome back, ${res.user.full_name}! Redirecting...`,
        });
        setTimeout(() => router.push("/tickets"), 1000);
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Authentication failed. Please verify your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md border border-white/15 bg-white/[0.03] p-8 backdrop-blur-md">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Home
      </Link>

      <div className="flex border-b border-white/15 pb-4">
        <button
          type="button"
          onClick={() => {
            setAuthMode("register");
            setStatusMessage(null);
          }}
          className={`flex-1 text-center text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
            authMode === "register" ? "text-[#FF00D4]" : "text-white/40 hover:text-white"
          }`}
        >
          Register
        </button>
        <span className="text-white/20">|</span>
        <button
          type="button"
          onClick={() => {
            setAuthMode("login");
            setStatusMessage(null);
          }}
          className={`flex-1 text-center text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
            authMode === "login" ? "text-[#FF00D4]" : "text-white/40 hover:text-white"
          }`}
        >
          Sign In
        </button>
      </div>

      {statusMessage && (
        <div
          className={`mt-6 flex items-center gap-3 border p-3.5 text-xs ${
            statusMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/40 bg-rose-500/10 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {authMode === "register" && (
          <>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-white/60">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="mt-2 w-full border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#FF00D4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-white/60">
                Registration Number / Student ID
              </label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. 12000000"
                className="mt-2 w-full border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#FF00D4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-white/60">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="mt-2 w-full border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#FF00D4] focus:outline-none"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-white/60">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            className="mt-2 w-full border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#FF00D4] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-white/60">
            Password *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#FF00D4] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 bg-[#FF00D4] py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:bg-[#FF2D87] disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : authMode === "register"
            ? "Create Account"
            : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_65%,rgba(255,0,212,0.10),transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-24 pt-32 sm:px-10 sm:pt-36 lg:px-16">
        <Suspense
          fallback={
            <div className="mx-auto max-w-md py-12 text-center text-xs uppercase tracking-[0.2em] text-white/40">
              Loading...
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}
