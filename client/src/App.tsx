import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Portfolio from "@/pages/portfolio";
import NotFound from "@/pages/not-found";

// Loading Component
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-800 to-black flex items-center justify-center z-50">
      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loading container */}
      <div className="relative flex flex-col items-center space-y-8">
        {/* Primary spinner with gradient border */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 animate-spin">
            <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-500 rounded-full" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full" />
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full" />
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* Pulsing rings */}
        <div className="absolute">
          <div className="w-32 h-32 border-2 border-gray-500/30 rounded-full animate-ping" />
          <div className="absolute inset-2 w-28 h-28 border border-gray-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-4 w-24 h-24 border border-gray-600/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>

        {/* Loading text with typewriter effect */}
        <div className="text-center space-y-2 z-10">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 bg-clip-text text-transparent">
              Loading
            </span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 rounded-full animate-pulse" 
                 style={{ 
                   width: '60%',
                   animation: 'loading-progress 2s ease-in-out infinite'
                 }} />
          </div>

          <p className="text-gray-400 text-sm animate-pulse">
            Preparing your portfolio...
          </p>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-20 -left-20">
          <div className="w-4 h-4 bg-gray-500/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
        </div>
        <div className="absolute -top-16 -right-24">
          <div className="w-3 h-3 bg-gray-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
        </div>
        <div className="absolute -bottom-20 -left-16">
          <div className="w-2 h-2 bg-gray-600/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '1.5s' }} />
        </div>
        <div className="absolute -bottom-24 -right-20">
          <div className="w-5 h-5 bg-gray-700/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2s' }} />
        </div>
      </div>

      <style>{`
        @keyframes loading-progress {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while app initializes
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;