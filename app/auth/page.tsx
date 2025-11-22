"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center px-4">
      <div className="bg-card rounded-lg shadow-xl border border-border p-8 w-full max-w-md animate-scaleIn">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">MADshop</h1>
          <h2 className="text-2xl font-bold text-foreground">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-foreground/70 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline ml-1">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        <div className="mt-6">
          <Link href="/">
            <Button variant="outline" className="w-full bg-transparent">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
