"use client";

import { useState } from "react";
import { useVultraStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  AlertOctagon,
  ShieldCheck,
  Zap,
  Settings2,
} from "lucide-react";

export default function ActionPanel() {
  const { systemStatus, deposit, withdraw, simulateAttack, unfreeze } =
    useVultraStore();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [feedback, setFeedback] = useState<{
    msg: string;
    type: "success" | "error" | "warn";
  } | null>(null);

  const isFrozen = systemStatus === "FROZEN";

  const showFeedback = (
    msg: string,
    type: "success" | "error" | "warn" = "success"
  ) => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (!depositAmount || isNaN(amt) || amt <= 0) {
      showFeedback("Enter a valid deposit amount", "error");
      return;
    }
    deposit(amt);
    setDepositAmount("");
    showFeedback(`✅ Successfully deposited $${amt.toLocaleString()}`, "success");
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!withdrawAmount || isNaN(amt) || amt <= 0) {
      showFeedback("Enter a valid withdrawal amount", "error");
      return;
    }
    const ok = withdraw(amt);
    setWithdrawAmount("");
    if (!ok) {
      showFeedback(
        isFrozen
          ? "❌ Withdrawals blocked — system is frozen"
          : "⚠️ Large withdrawal triggered a freeze!",
        "error"
      );
    } else {
      showFeedback(`✅ Withdrew $${amt.toLocaleString()} successfully`, "success");
    }
  };

  const handleAttack = () => {
    simulateAttack();
    showFeedback(
      "🚨 Flash loan attack simulated — system FROZEN",
      "error"
    );
  };

  const handleUnfreeze = () => {
    unfreeze();
    showFeedback("✅ System unfrozen — operations resumed", "success");
  };

  const feedbackColors = {
    success: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", color: "var(--success)" },
    error: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", color: "var(--danger)" },
    warn: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "var(--warning)" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card"
      style={{ padding: 24 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Settings2 size={18} color="var(--accent)" />
        <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
          Action Panel
        </h3>
        {isFrozen && (
          <span className="badge badge-danger" style={{ marginLeft: "auto" }}>
            🔒 Locked
          </span>
        )}
      </div>

      {/* Deposit */}
      <div style={{ marginBottom: 14 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Deposit Amount (USDC)
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.00"
            className="input-field"
            min="0"
          />
          <button
            onClick={handleDeposit}
            className="btn btn-success"
            style={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            <ArrowDownCircle size={16} />
            Deposit
          </button>
        </div>
      </div>

      {/* Withdraw */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Withdraw Amount (USDC)
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="0.00"
            className="input-field"
            disabled={isFrozen}
            min="0"
          />
          <button
            onClick={handleWithdraw}
            disabled={isFrozen}
            className="btn btn-ghost"
            style={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            <ArrowUpCircle size={16} />
            Withdraw
          </button>
        </div>
        {isFrozen && (
          <div
            style={{
              marginTop: 6,
              fontSize: "0.75rem",
              color: "var(--danger)",
              opacity: 0.85,
            }}
          >
            ⚠️ Withdrawals temporarily disabled while system is frozen
          </div>
        )}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "var(--border)",
          marginBottom: 16,
        }}
      />

      {/* Admin controls */}
      <div
        style={{
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        Demo Controls
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleAttack}
          className="btn btn-danger"
          style={{ flex: 1, justifyContent: "center" }}
          disabled={isFrozen}
        >
          <AlertOctagon size={16} />
          Simulate Attack
        </button>
        <button
          onClick={handleUnfreeze}
          className="btn btn-warning"
          style={{ flex: 1, justifyContent: "center" }}
          disabled={!isFrozen}
        >
          <ShieldCheck size={16} />
          Unfreeze
        </button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 10,
              background: feedbackColors[feedback.type].bg,
              border: `1px solid ${feedbackColors[feedback.type].border}`,
              color: feedbackColors[feedback.type].color,
              fontSize: "0.83rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Zap size={14} />
            {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
