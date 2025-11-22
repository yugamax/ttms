"use client"

export function OpeningAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-background to-accent overflow-hidden animate-fadeInSlow">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center animate-slideInFromTopSlow">
        <div className="mb-8 inline-block">
          <div className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-pulse-glow-slow px-4 py-2">
            MADshop
          </div>
        </div>
        <p className="text-xl text-foreground/80 font-light mt-4 animate-fadeInSlow animation-delay-300">
          Smart Shopping. Smarter Prices.
        </p>

        {/* Loading indicator */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce-slow" style={{ animationDelay: "0s" }} />
          <div className="w-3 h-3 bg-secondary rounded-full animate-bounce-slow" style={{ animationDelay: "0.3s" }} />
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce-slow" style={{ animationDelay: "0.6s" }} />
        </div>
      </div>

      <style>{`
        @keyframes animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeInSlow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 2.5s ease-in-out;
        }
        @keyframes slideInFromTopSlow {
          from { transform: translateY(-60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideInFromTopSlow {
          animation: slideInFromTopSlow 2.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes pulseGlowSlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
        .animate-pulse-glow-slow {
          animation: pulseGlowSlow 2.5s infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 1.8s infinite;
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-24px); }
        }
        .animate-float-slow {
          animation: floatSlow 4s infinite;
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 2.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
