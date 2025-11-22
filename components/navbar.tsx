"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-context"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ShoppingCart, LogOut, LogIn, User, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const router = useRouter()
  const { user } = useAuth()
  const { items } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    setMenuOpen(false)
    router.push("/")
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-40 bg-background border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient-shift">
              MADshop
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden lg:flex gap-6 items-center">
            <Link href="/products" className="text-foreground hover:text-primary transition-smooth">
              Products
            </Link>
            {user && (
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-smooth">
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side icons and buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Link href="/cart" className="relative hover:text-primary transition-smooth">
              <ShoppingCart size={24} className="hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-smooth"
                  title={user.email || ""}
                >
                  <User size={20} />
                  <span className="hidden lg:inline text-sm truncate">{user.email?.split("@")[0]}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-smooth"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth btn-hover-glow"
              >
                <LogIn size={20} />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-smooth"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-3 animate-slideInFromTop">
            <div className="px-2">
              <SearchBar />
            </div>
            <Link
              href="/products"
              className="block px-4 py-2 hover:bg-muted rounded transition-smooth"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 hover:bg-muted rounded transition-smooth"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {!user && (
              <Link
                href="/auth"
                className="block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-smooth"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
