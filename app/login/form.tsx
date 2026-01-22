'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

function SubmitButton() {
    return (
        <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25 ring-1 ring-white/10"
        >
            Sign In
        </button>
    );
}

export default function LoginForm() {
    const [state, action] = useActionState(loginAction, null);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 mt-2">Sign in to access your courses</p>
                    </div>

                    <form action={action} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {state?.error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {state.error}
                            </div>
                        )}

                        <SubmitButton />

                        <div className="text-center text-sm text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
