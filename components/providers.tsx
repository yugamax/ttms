"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/cart-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}
