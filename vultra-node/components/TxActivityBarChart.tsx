"use client";

import { useVultraStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart2 } from "lucide-react";

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
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TxActivityBarChart() {
  const { txActivity } = useVultraStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
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
          <BarChart2 size={18} color="#a78bfa" />
          <h3
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text-primary)",
            }}
          >
            Transaction Activity
          </h3>
        </div>
        <span className="badge badge-accent">Real-time</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={txActivity} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,34,53,0.8)" vertical={false} />
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
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
          />
          <Bar
            dataKey="deposits"
            name="Deposits"
            fill="#4f6ef7"
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          />
          <Bar
            dataKey="withdrawals"
            name="Withdrawals"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          />
          <Bar
            dataKey="attacks"
            name="Attacks"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
