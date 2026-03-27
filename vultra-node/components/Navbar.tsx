"use client";

import { useVultraStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Shield, Wallet, LogOut, Activity } from "lucide-react";

export default function Navbar() {
  const { walletAddress, systemStatus, disconnectWallet } = useVultraStore();

  const isFrozen = systemStatus === "FROZEN";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,11,15,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #4f6ef7, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(79,110,247,0.4)",
            }}
          >
            <Shield size={20} color="white" />
          </div>
          <div>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
                color: "var(--text-primary)",
              }}
            >
              Vultra-Node
            </span>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Liquidity Protocol
            </div>
          </div>
        </div>

        {/* Center nav items */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="badge badge-accent"
            style={{ gap: 6 }}
          >
            <Activity size={12} />
            DeFi Dashboard
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* System status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: isFrozen
                ? "rgba(239,68,68,0.12)"
                : "rgba(34,197,94,0.12)",
              border: `1px solid ${isFrozen ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isFrozen ? "var(--danger)" : "var(--success)",
                boxShadow: isFrozen
                  ? "0 0 8px var(--danger)"
                  : "0 0 8px var(--success)",
              }}
              className={isFrozen ? "" : "pulse-glow"}
            />
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: isFrozen ? "var(--danger)" : "var(--success)",
                letterSpacing: "0.04em",
              }}
            >
              {isFrozen ? "FROZEN" : "NORMAL"}
            </span>
          </div>

          {/* Wallet address */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 10,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <Wallet size={15} color="var(--accent)" />
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: "monospace",
              }}
            >
              {walletAddress}
            </span>
          </div>

          {/* Disconnect */}
          <button
            onClick={disconnectWallet}
            className="btn btn-ghost"
            style={{ padding: "8px 12px", gap: 6 }}
            title="Disconnect wallet"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
