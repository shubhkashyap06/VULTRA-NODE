"use client";

import { useVultraStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Unlock, Timer } from "lucide-react";

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export default function VestingSection() {
  const { vestingProgress, vestingTotal, vestingUnlocked } = useVultraStore();

  const locked = vestingTotal - vestingUnlocked;

  const milestones = [
    { pct: 25, label: "Q1" },
    { pct: 50, label: "Q2" },
    { pct: 75, label: "Q3" },
    { pct: 100, label: "Q4" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card"
      style={{ padding: 24 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Unlock size={18} color="#a78bfa" />
        <h3
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--text-primary)",
          }}
        >
          Token Vesting
        </h3>
      </div>

      {/* Progress ring proxy — linear */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Unlocked
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {vestingProgress}%
          </span>
        </div>

        {/* Bar track */}
        <div
          style={{
            height: 10,
            background: "var(--bg-secondary)",
            borderRadius: 999,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${vestingProgress}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #4f6ef7, #a78bfa, #38bdf8)",
              borderRadius: 999,
              boxShadow: "0 0 12px rgba(167,139,250,0.5)",
            }}
          />
        </div>

        {/* Milestones */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          {milestones.map((m) => (
            <div
              key={m.label}
              style={{
                fontSize: "0.65rem",
                color:
                  vestingProgress >= m.pct
                    ? "#a78bfa"
                    : "var(--text-muted)",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: 10,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Total Allocation
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "monospace",
            }}
          >
            {formatNum(vestingTotal)} VLT
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(167,139,250,0.08)",
            border: "1px solid rgba(167,139,250,0.2)",
          }}
        >
          <span style={{ fontSize: "0.78rem", color: "#a78bfa" }}>
            ✅ Unlocked
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#a78bfa",
              fontFamily: "monospace",
            }}
          >
            {formatNum(vestingUnlocked)} VLT
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: 10,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Timer size={12} color="var(--text-muted)" />
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Remaining
            </span>
          </div>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              fontFamily: "monospace",
            }}
          >
            {formatNum(locked)} VLT
          </span>
        </div>
      </div>
    </motion.div>
  );
}
