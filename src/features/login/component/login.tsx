import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // TODO: call login api
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md rounded-2xl border border-slate-200 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-slate-900">
            Login
          </CardTitle>
          <p className="text-sm text-slate-500">Sign in to continue</p>
        </CardHeader>

        <div className="px-6 pb-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Email">
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </Field>

            <Field
              label={
                <div className="flex items-center justify-between w-full">
                  <span>Password</span>
                  <button
                    type="button"
                    className="text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    Forgot?
                  </button>
                </div>
              }
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-14 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-slate-500 hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-slate-900/30 active:scale-[0.99] transition"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-slate-500">
              Don’t have an account?{" "}
              <button
                type="button"
                className="font-medium text-slate-900 hover:underline"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}
