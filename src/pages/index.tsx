import { useState } from "react";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { ChatInterface } from "@/components/ChatInterface";
import { PortfolioManager } from "@/components/PortfolioManager";
import { PortfolioAnalysis } from "@/components/PortfolioAnalysis";
import { Navigation } from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeView, setActiveView] = useState<"trading" | "portfolio">("trading");

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeView={activeView} onViewChange={setActiveView} />

      <AnimatePresence mode="wait">
        {activeView === "trading" && (
          <motion.section
            key="trading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-16"
          >
            <div className="h-[calc(100vh-4rem)]">
              <div className="flex h-full">
                <div className="w-[60%] border-r border-border/20">
                  <TradingViewWidget />
                </div>
                <div className="w-[40%]">
                  <ChatInterface />
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeView === "portfolio" && (
          <motion.section
            key="portfolio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen pt-24"
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="space-y-16">
                <div className="text-center">
                  <h2 className="text-5xl font-bold gradient-text mb-6">
                    Portfolio Manager
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Track your investments and get AI-powered insights
                  </p>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold gradient-text">
                      Track Your Stocks
                    </h3>
                    <div className="glass-effect rounded-xl p-6 card-hover">
                      <PortfolioManager />
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6 card-hover">
                    <PortfolioAnalysis />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}