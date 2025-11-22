"use client"

import Link from "next/link"
import { Github, Twitter, Facebook, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-3">MADshop</h3>
            <p className="text-foreground/70 text-xs sm:text-sm">
              Smart shopping with price tracking and exclusive deals from your favorite retailers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/products" className="text-foreground/70 hover:text-primary transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-foreground/70 hover:text-primary transition">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-foreground/70 hover:text-primary transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="#" className="text-foreground/70 hover:text-primary transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-primary transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-primary transition">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Follow Us</h4>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="text-foreground/70 hover:text-primary transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition">
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-foreground/70">© 2025 MADshop. All rights reserved.</p>
          <p className="text-xs sm:text-sm text-foreground/70">Made with ❤️ for smarter shopping</p>
        </div>
      </div>
    </footer>
  )
}
