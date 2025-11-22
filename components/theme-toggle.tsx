"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if dark mode is already set
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newDarkState = !isDark
    setIsDark(newDarkState)

    if (newDarkState) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
    </button>
  )
}
