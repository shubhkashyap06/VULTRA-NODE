"use client";

import { useVultraStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: "0.8rem",
          color: "var(--text-primary)",
        }}
      >
        <div style={{ color: "var(--text-muted)", marginBottom: 6 }}>
          {label}
        </div>
        {payload.map((p: any) => (
          <div
            key={p.name}
            style={{ color: p.color, fontWeight: 600 }}
          >
            {p.name}: ${Number(p.value).toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function LiquidityLineChart() {
  const { liquidityHistory } = useVultraStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="glass-card"
      style={{ padding: 24 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TrendingUp size={18} color="var(--accent)" />
          <h3
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text-primary)",
            }}
          >
            Liquidity Over Time
          </h3>
        </div>
        <span className="badge badge-accent">Live</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={liquidityHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="liquidityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lockedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,34,53,0.8)" />
          <XAxis
            dataKey="time"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
          />
          <Area
            type="monotone"
            dataKey="liquidity"
            name="Total Liquidity"
            stroke="#4f6ef7"
            strokeWidth={2.5}
            fill="url(#liquidityGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#4f6ef7" }}
          />
          <Area
            type="monotone"
            dataKey="locked"
            name="Frozen"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#lockedGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#ef4444" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
