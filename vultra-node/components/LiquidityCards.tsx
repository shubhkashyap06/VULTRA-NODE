"use client";

import { useVultraStore } from "@/lib/store";
import { motion } from "framer-motion";
import { TrendingUp, Droplets, Lock, DollarSign } from "lucide-react";

function formatUSD(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${val.toFixed(0)}`;
}

function pct(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

const cards = [
  {
    key: "total",
    label: "Total Liquidity Locked",
    icon: DollarSign,
    color: "var(--accent)",
    glowColor: "rgba(79,110,247,0.2)",
    getValue: (s: ReturnType<typeof useVultraStore>) => s.totalLiquidity,
    getChange: () => "+12.4%",
    changePositive: true,
  },
  {
    key: "available",
    label: "Available Liquidity",
    icon: Droplets,
    color: "var(--success)",
    glowColor: "rgba(34,197,94,0.15)",
    getValue: (s: ReturnType<typeof useVultraStore>) => s.availableLiquidity,
    getChange: (s: ReturnType<typeof useVultraStore>) =>
      `${pct(s.availableLiquidity, s.totalLiquidity)}% of pool`,
    changePositive: true,
  },
  {
    key: "frozen",
    label: "Frozen / Locked",
    icon: Lock,
    color: "var(--danger)",
    glowColor: "rgba(239,68,68,0.15)",
    getValue: (s: ReturnType<typeof useVultraStore>) => s.frozenLiquidity,
    getChange: (s: ReturnType<typeof useVultraStore>) =>
      s.frozenLiquidity > 0 ? "⚠️ Protected" : "✅ Clear",
    changePositive: false,
  },
  {
    key: "health",
    label: "Pool Health Score",
    icon: TrendingUp,
    color: "#f59e0b",
    glowColor: "rgba(245,158,11,0.15)",
    getValue: (s: ReturnType<typeof useVultraStore>) =>
      s.systemStatus === "FROZEN" ? 34 : 91,
    getChange: (s: ReturnType<typeof useVultraStore>) =>
      s.systemStatus === "FROZEN" ? "Degraded" : "Excellent",
    changePositive: true,
    isScore: true,
  },
];

export default function LiquidityCards() {
  const store = useVultraStore();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
      }}
    >
      {cards.map((card, i) => {
        const value = card.getValue(store);
        const change =
          typeof card.getChange === "function"
            ? card.getChange(store)
            : card.getChange;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="glass-card"
            style={{ padding: 24, position: "relative", overflow: "hidden" }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: card.glowColor,
                pointerEvents: "none",
              }}
            />

            {/* Icon */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: card.glowColor,
                border: `1px solid ${card.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <card.icon size={20} color={card.color} />
            </div>

            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {card.label}
            </div>

            <div
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              {card.isScore ? `${value}/100` : formatUSD(value as number)}
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: card.changePositive ? "var(--success)" : "var(--danger)",
                fontWeight: 600,
              }}
            >
              {change}
            </div>

            {/* Score bar */}
            {card.isScore && (
              <div
                style={{
                  marginTop: 12,
                  background: "var(--bg-secondary)",
                  borderRadius: 4,
                  height: 4,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, ${card.color}, ${card.color}80)`,
                    borderRadius: 4,
                  }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
