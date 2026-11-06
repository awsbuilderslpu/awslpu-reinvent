"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  User,
} from "lucide-react";
import {
  apiRequest,
  setStoredToken,
  type AuthResponse,
} from "@/lib/api";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode =
    searchParams.get("mode") === "login" ? "login" : "register";

  const [authMode, setAuthMode] = useState<"login" | "register">(initialMode);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const switchMode = (mode: "login" | "register") => {
    setAuthMode(mode);
    setStatusMessage(null);
    router.replace(`/auth?mode=${mode}`, { scroll: false });
  };

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
          text: "Account created successfully. Redirecting...",
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
        text:
          err.message ||
          "Authentication failed. Please verify your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent py-4 text-base text-white placeholder-white/25 outline-none transition-colors focus:placeholder-white/15";

  const labelClass =
    "mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-[#6C00FF]/15 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-[#FF00D4]/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.2),transparent_50%,rgba(5,5,5,0.3))]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1700px] flex-col px-6 pb-10 pt-28 sm:px-10 lg:px-16 lg:pt-32">
        <div className="grid flex-1 items-center gap-16 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:py-16">
          <section className="relative">
            <p className="mb-8 flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-[#FF2D87]">
              <span className="h-px w-8 bg-[#FF00D4]" />
              YOUR JOURNEY STARTS HERE
            </p>

            <h1 className="text-[clamp(4rem,9vw,9rem)] font-extrabold leading-[0.78] tracking-[-0.09em]">
              BE PART
              <br />
              OF THE
              <br />
              <span className="text-[#FF00D4]">FUTURE.</span>
            </h1>

            <p className="mt-10 max-w-lg text-base leading-8 text-white/55 sm:text-lg">
              One community. Five days. Countless possibilities. Create your
              account and get ready to experience Re:Invent Fest.
            </p>

            <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/15 pt-7">
              <div>
                <p className="text-2xl font-bold tracking-tight">05</p>
                <p className="mt-1 text-[10px] tracking-[0.16em] text-white/40">
                  DAYS
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold tracking-tight">01</p>
                <p className="mt-1 text-[10px] tracking-[0.16em] text-white/40">
                  COMMUNITY
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold tracking-tight">∞</p>
                <p className="mt-1 text-[10px] tracking-[0.16em] text-white/40">
                  POSSIBILITIES
                </p>
              </div>
            </div>

            <div className="mt-16 hidden items-center gap-3 text-[10px] tracking-[0.18em] text-white/30 lg:flex">
              <span className="h-px w-8 bg-white/20" />
              AWS STUDENT BUILDER GROUP · LPU
            </div>
          </section>

          <section className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
            <div className="mb-12">
              <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-[#FF2D87]">
                {authMode === "register"
                  ? "GET STARTED"
                  : "GOOD TO HAVE YOU BACK"}
              </p>

              <h2 className="text-4xl font-bold tracking-[-0.06em] sm:text-5xl">
                {authMode === "register" ? (
                  <>
                    Create your
                    <br />
                    <span className="text-white/40">account.</span>
                  </>
                ) : (
                  <>
                    Welcome
                    <br />
                    <span className="text-white/40">back.</span>
                  </>
                )}
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/45">
                {authMode === "register"
                  ? "A few details and you're ready to go."
                  : "Sign in to continue to your festival experience."}
              </p>
            </div>

            <div className="mb-10 flex border-b border-white/15">
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`relative flex-1 pb-4 text-left text-xs font-semibold tracking-[0.15em] transition-colors ${
                  authMode === "register"
                    ? "text-[#FF00D4]"
                    : "text-white/35 hover:text-white"
                }`}
              >
                CREATE ACCOUNT
                {authMode === "register" && (
                  <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-[#FF00D4]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`relative flex-1 pb-4 text-left text-xs font-semibold tracking-[0.15em] transition-colors ${
                  authMode === "login"
                    ? "text-[#FF00D4]"
                    : "text-white/35 hover:text-white"
                }`}
              >
                SIGN IN
                {authMode === "login" && (
                  <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-[#FF00D4]" />
                )}
              </button>
            </div>

            {statusMessage && (
              <div
                className={`mb-8 flex items-start gap-3 border-b pb-4 text-sm ${
                  statusMessage.type === "success"
                    ? "border-emerald-500/30 text-emerald-300"
                    : "border-rose-500/30 text-rose-300"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {authMode === "register" && (
                <>
                  <div className="border-b border-white/20 transition-colors focus-within:border-[#FF00D4]">
                    <label className={labelClass}>Full Name *</label>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 shrink-0 text-white/30" />
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="border-b border-white/20 transition-colors focus-within:border-[#FF00D4]">
                    <label className={labelClass}>
                      Registration Number / Student ID
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="Your university ID"
                      className={inputClass}
                    />
                  </div>

                  <div className="border-b border-white/20 transition-colors focus-within:border-[#FF00D4]">
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              <div className="border-b border-white/20 transition-colors focus-within:border-[#FF00D4]">
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div className="border-b border-white/20 transition-colors focus-within:border-[#FF00D4]">
                <label className={labelClass}>Password *</label>
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 shrink-0 text-white/30" />
                  <input
                    type="password"
                    required
                    autoComplete={
                      authMode === "register"
                        ? "new-password"
                        : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-between bg-[#FF00D4] px-6 py-5 text-sm font-bold tracking-[0.12em] text-black transition-all hover:bg-[#FF2D87] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {loading
                    ? "PROCESSING..."
                    : authMode === "register"
                      ? "CREATE MY ACCOUNT"
                      : "SIGN IN"}
                </span>

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <p className="mt-8 text-center text-xs leading-6 text-white/35">
              {authMode === "register"
                ? "Already have an account?"
                : "New to Re:Invent Fest?"}{" "}
              <button
                type="button"
                onClick={() =>
                  switchMode(authMode === "register" ? "login" : "register")
                }
                className="font-semibold text-white transition-colors hover:text-[#FF00D4]"
              >
                {authMode === "register" ? "Sign in" : "Create an account"}
              </button>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#050505] text-xs tracking-[0.2em] text-white/40">
          LOADING...
        </main>
      }
    >
      <AuthForm />
    </Suspense>
  );
}