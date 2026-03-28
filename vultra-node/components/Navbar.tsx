"use client";

import { useVultraStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ExternalLink, User } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ThreatMeter from "@/components/ThreatMeter";
import ProfileModal from "@/components/ProfileModal";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Navbar() {
  const { systemStatus, isFrozen, threatScore, userEmail } = useVultraStore();
  const { isConnected } = useAccount();
  const [profileOpen, setProfileOpen] = useState(false);

  // Auto-show mandatory profile setup if wallet connected but no email saved
  useEffect(() => {
    if (isConnected && !userEmail) {
      const timer = setTimeout(() => setProfileOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isConnected, userEmail]);

  return (
    <>
      {/* Freeze overlay flash */}
      <AnimatePresence>
        {isFrozen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.12, 0, 0.08, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "#ef4444",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(5,7,13,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: isFrozen
            ? "1px solid rgba(239,68,68,0.4)"
            : "1px solid var(--border)",
          transition: "border-color 0.4s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1440, margin: "0 auto", padding: "0 24px",
            height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.div
              animate={isFrozen ? { filter: ["drop-shadow(0 0 4px rgba(239,68,68,0.4))", "drop-shadow(0 0 16px rgba(239,68,68,0.8))", "drop-shadow(0 0 4px rgba(239,68,68,0.4))"] } : {filter: "drop-shadow(0 0 8px rgba(59,130,246,0.3))"}}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 48, height: 48,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <img src="/logo.png" alt="Vultra Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </motion.div>
            <div>
              <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
                Vultra-Node
              </span>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Liquidity Protocol
              </div>
            </div>
          </div>

          {/* Center — threat meter compact */}
          <div style={{ width: 220 }}>
            <ThreatMeter compact />
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* System status pill */}
            <motion.div
              animate={isFrozen ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 999,
                background: isFrozen ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.1)",
                border: `1px solid ${isFrozen ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.28)"}`,
              }}
            >
              <div
                style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: isFrozen ? "var(--danger)" : "var(--success)",
                  boxShadow: isFrozen ? "0 0 8px var(--danger)" : "0 0 8px var(--success)",
                }}
                className={isFrozen ? "pulse-danger" : "pulse-glow"}
              />
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: isFrozen ? "var(--danger)" : "var(--success)", letterSpacing: "0.05em" }}>
                {isFrozen ? "LOCKDOWN" : "ACTIVE"}
              </span>
            </motion.div>

            {/* Attacker portal link */}
            <a
              href="/attacker"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 13px", borderRadius: 9,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444", fontSize: "0.78rem", fontWeight: 700,
                textDecoration: "none", transition: "all 0.18s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.16)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
            >
              <ExternalLink size={13} />
              Attacker
            </a>

            <RawConnectButton />

            {/* Profile button */}
            <button
              onClick={() => setProfileOpen(true)}
              title={userEmail ? `Profile: ${userEmail}` : "Set security email"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: 9,
                background: userEmail ? "rgba(34,197,94,0.1)" : "rgba(249,115,22,0.1)",
                border: userEmail ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(249,115,22,0.4)",
                cursor: "pointer", position: "relative",
              }}
            >
              <User size={16} color={userEmail ? "#22c55e" : "#f97316"} />
              {!userEmail && (
                <span style={{
                  position: "absolute", top: -3, right: -3,
                  width: 9, height: 9, borderRadius: "50%",
                  background: "#f97316", border: "2px solid #050810",
                }} />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        mandatory={isConnected && !userEmail}
      />
    </>
  );
}


function RawConnectButton() {
  const { connect } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const handleConnect = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        // Force the browser to trigger MetaMask directly through the lowest-level injected hook
        connect({ connector: injected() });
      } else {
        alert("MetaMask (window.ethereum) is not detected in your browser!");
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (isConnected && address) {
    return (
      <button 
        onClick={() => disconnect()}
        className="btn"
        style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)", padding: "8px 16px" }}
      >
        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "white" }}>
          {address.slice(0,6)}...{address.slice(-4)}
        </span>
      </button>
    )
  }

  return (
    <button 
      onClick={handleConnect}
      className="btn"
      style={{ background: "#3b82f6", color: "white", padding: "8px 16px", fontWeight: 700 }}
    >
      Connect MetaMask
    </button>
  )
}
