import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, LayoutGrid } from "lucide-react";

interface NavigationProps {
  activeView: "trading" | "portfolio";
  onViewChange: (view: "trading" | "portfolio") => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-xl">T</span>
          </div>
          <span className="font-bold text-xl gradient-text">Tradie</span>
        </div>

        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
          <button
            onClick={() => onViewChange("trading")}
            className={`nav-item flex items-center gap-2 ${activeView === "trading" ? "active" : ""}`}
          >
            <LineChart className="h-4 w-4" />
            Trading
          </button>
          <button
            onClick={() => onViewChange("portfolio")}
            className={`nav-item flex items-center gap-2 ${activeView === "portfolio" ? "active" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" />
            Portfolio
          </button>
        </div>
      </div>
    </nav>
  );
};