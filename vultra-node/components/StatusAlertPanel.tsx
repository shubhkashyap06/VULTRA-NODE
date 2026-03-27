"use client";

import { useVultraStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  ShieldOff,
  Shield,
  Bell,
} from "lucide-react";

export default function StatusAlertPanel() {
  const { systemStatus, alertMessage } = useVultraStore();
  const isFrozen = systemStatus === "FROZEN";

  const isAttack = alertMessage.includes("Flash loan") || alertMessage.includes("CRITICAL");
  const isWarning = alertMessage.includes("Suspicious") || alertMessage.includes("triggered");

  const AlertIcon = isAttack
    ? AlertOctagon
    : isWarning
    ? AlertTriangle
    : CheckCircle;

  const alertColor = isFrozen
    ? "var(--danger)"
    : alertMessage.includes("✅")
    ? "var(--success)"
    : "var(--text-secondary)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
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
        <Bell size={18} color="var(--accent)" />
        <h3
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--text-primary)",
          }}
        >
          Status & Alerts
        </h3>
      </div>

      {/* System status big indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={systemStatus}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "18px 20px",
            borderRadius: 14,
            background: isFrozen
              ? "rgba(239,68,68,0.08)"
              : "rgba(34,197,94,0.08)",
            border: `1px solid ${isFrozen ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: isFrozen
                ? "rgba(239,68,68,0.15)"
                : "rgba(34,197,94,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isFrozen ? (
              <ShieldOff size={24} color="var(--danger)" />
            ) : (
              <Shield size={24} color="var(--success)" />
            )}
          </div>
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              System Status
            </div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: isFrozen ? "var(--danger)" : "var(--success)",
                letterSpacing: "-0.01em",
              }}
            >
              {systemStatus}
            </div>
            {isFrozen && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--danger)",
                  marginTop: 2,
                  opacity: 0.8,
                }}
              >
                Withdrawals temporarily disabled
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Alert message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={alertMessage}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 10, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            display: "flex",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 12,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <AlertIcon size={18} color={alertColor} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Latest Alert
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: isFrozen ? "var(--danger)" : "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {alertMessage}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mini status dots */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Price Feed", ok: true },
          { label: "Oracle", ok: !isFrozen },
          { label: "Liquidity", ok: !isFrozen },
          { label: "Governance", ok: true },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 8,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              fontSize: "0.73rem",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: item.ok ? "var(--success)" : "var(--danger)",
              }}
            />
            {item.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
