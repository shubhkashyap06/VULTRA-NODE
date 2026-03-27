"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVultraStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import LiquidityCards from "@/components/LiquidityCards";
import StatusAlertPanel from "@/components/StatusAlertPanel";
import LiquidityLineChart from "@/components/LiquidityLineChart";
import TxActivityBarChart from "@/components/TxActivityBarChart";
import ActionPanel from "@/components/ActionPanel";
import TransactionHistory from "@/components/TransactionHistory";
import VestingSection from "@/components/VestingSection";

export default function DashboardPage() {
  const { isConnected } = useVultraStore();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected) return null;

  return (
    <div
      className="bg-grid"
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingBottom: 48,
      }}
    >
      <Navbar />

      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "28px 24px 0",
        }}
      >
        {/* Row 1: Liquidity Cards */}
        <LiquidityCards />

        {/* Row 2: Status + Action Panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
          className="dashboard-row-2"
        >
          <StatusAlertPanel />
          <ActionPanel />
        </div>

        {/* Row 3: Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
          className="dashboard-row-3"
        >
          <LiquidityLineChart />
          <TxActivityBarChart />
        </div>

        {/* Row 4: History + Vesting */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
          className="dashboard-row-4"
        >
          <TransactionHistory />
          <VestingSection />
        </div>
      </main>
    </div>
  );
}
