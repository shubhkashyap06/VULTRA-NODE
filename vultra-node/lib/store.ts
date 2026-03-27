import { create } from "zustand";

export type SystemStatus = "NORMAL" | "FROZEN";
export type TxType = "DEPOSIT" | "WITHDRAW" | "ATTACK" | "UNFREEZE";

export interface Transaction {
  id: string;
  type: TxType;
  amount?: number;
  timestamp: Date;
  status: "SUCCESS" | "BLOCKED" | "ATTACK";
  note?: string;
}

export interface LiquidityPoint {
  time: string;
  liquidity: number;
  locked: number;
}

export interface TxActivityPoint {
  time: string;
  deposits: number;
  withdrawals: number;
  attacks: number;
}

export interface VultraStore {
  // Wallet
  walletAddress: string | null;
  isConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;

  // System state
  systemStatus: SystemStatus;
  alertMessage: string;
  
  // Liquidity
  totalLiquidity: number;
  availableLiquidity: number;
  frozenLiquidity: number;

  // Actions
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  simulateAttack: () => void;
  unfreeze: () => void;

  // Transactions
  transactions: Transaction[];

  // Chart data
  liquidityHistory: LiquidityPoint[];
  txActivity: TxActivityPoint[];

  // Vesting
  vestingProgress: number;
  vestingTotal: number;
  vestingUnlocked: number;
}

const generateTimeLabel = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
};

const MOCK_WALLET = "0x71C...d3f9";

const initialLiquidityHistory: LiquidityPoint[] = [
  { time: "09:00", liquidity: 15000, locked: 2000 },
  { time: "09:30", liquidity: 17500, locked: 2000 },
  { time: "10:00", liquidity: 16800, locked: 3200 },
  { time: "10:30", liquidity: 19200, locked: 3200 },
  { time: "11:00", liquidity: 21500, locked: 4000 },
  { time: "11:30", liquidity: 20100, locked: 4000 },
  { time: "12:00", liquidity: 22800, locked: 5000 },
];

const initialTxActivity: TxActivityPoint[] = [
  { time: "09:00", deposits: 3, withdrawals: 1, attacks: 0 },
  { time: "09:30", deposits: 5, withdrawals: 2, attacks: 0 },
  { time: "10:00", deposits: 2, withdrawals: 4, attacks: 0 },
  { time: "10:30", deposits: 8, withdrawals: 3, attacks: 0 },
  { time: "11:00", deposits: 4, withdrawals: 2, attacks: 1 },
  { time: "11:30", deposits: 6, withdrawals: 1, attacks: 0 },
  { time: "12:00", deposits: 7, withdrawals: 3, attacks: 0 },
];

export const useVultraStore = create<VultraStore>((set, get) => ({
  // Wallet
  walletAddress: null,
  isConnected: false,
  connectWallet: () => {
    set({ walletAddress: MOCK_WALLET, isConnected: true });
  },
  disconnectWallet: () => {
    set({ walletAddress: null, isConnected: false });
  },

  // System state
  systemStatus: "NORMAL",
  alertMessage: "No suspicious activity detected.",

  // Liquidity
  totalLiquidity: 22800,
  availableLiquidity: 17800,
  frozenLiquidity: 5000,

  // Transactions
  transactions: [
    {
      id: "tx001",
      type: "DEPOSIT",
      amount: 5000,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: "SUCCESS",
      note: "USDC deposited",
    },
    {
      id: "tx002",
      type: "WITHDRAW",
      amount: 1200,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "SUCCESS",
      note: "Normal withdrawal",
    },
    {
      id: "tx003",
      type: "DEPOSIT",
      amount: 3500,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: "SUCCESS",
      note: "ETH deposited",
    },
  ],

  liquidityHistory: initialLiquidityHistory,
  txActivity: initialTxActivity,

  // Vesting
  vestingProgress: 42,
  vestingTotal: 100000,
  vestingUnlocked: 42000,

  // Actions
  deposit: (amount: number) => {
    const { totalLiquidity, availableLiquidity, liquidityHistory, txActivity, transactions, vestingProgress } = get();
    const newTotal = totalLiquidity + amount;
    const newAvail = availableLiquidity + amount;
    const label = generateTimeLabel();

    const newLiqHistory: LiquidityPoint[] = [
      ...liquidityHistory.slice(-11),
      { time: label, liquidity: newTotal, locked: newTotal - newAvail },
    ];

    const lastTx = txActivity[txActivity.length - 1];
    const newTxActivity: TxActivityPoint[] = [
      ...txActivity.slice(-11),
      { time: label, deposits: (lastTx?.deposits || 0) + 1, withdrawals: 0, attacks: 0 },
    ];

    const newTx: Transaction = {
      id: `tx${Date.now()}`,
      type: "DEPOSIT",
      amount,
      timestamp: new Date(),
      status: "SUCCESS",
      note: "Liquidity deposited",
    };

    set({
      totalLiquidity: newTotal,
      availableLiquidity: newAvail,
      liquidityHistory: newLiqHistory,
      txActivity: newTxActivity,
      transactions: [newTx, ...transactions].slice(0, 20),
      vestingProgress: Math.min(vestingProgress + 2, 100),
      vestingUnlocked: Math.min(get().vestingUnlocked + amount * 0.1, get().vestingTotal),
    });
  },

  withdraw: (amount: number): boolean => {
    const { systemStatus, totalLiquidity, availableLiquidity, liquidityHistory, txActivity, transactions } = get();

    if (systemStatus === "FROZEN") {
      const blockedTx: Transaction = {
        id: `tx${Date.now()}`,
        type: "WITHDRAW",
        amount,
        timestamp: new Date(),
        status: "BLOCKED",
        note: "Blocked — system frozen",
      };
      set({ transactions: [blockedTx, ...transactions].slice(0, 20) });
      return false;
    }

    const pct = amount / totalLiquidity;
    if (pct > 0.3) {
      // Trigger freeze
      const label = generateTimeLabel();
      const newLiqHistory: LiquidityPoint[] = [
        ...liquidityHistory.slice(-11),
        { time: label, liquidity: totalLiquidity, locked: totalLiquidity },
      ];
      const lastTx = txActivity[txActivity.length - 1];
      const newTxActivity: TxActivityPoint[] = [
        ...txActivity.slice(-11),
        { time: label, deposits: 0, withdrawals: (lastTx?.withdrawals || 0) + 1, attacks: 1 },
      ];
      const blockedTx: Transaction = {
        id: `tx${Date.now()}`,
        type: "WITHDRAW",
        amount,
        timestamp: new Date(),
        status: "BLOCKED",
        note: `Large withdrawal (${(pct * 100).toFixed(1)}%) triggered freeze`,
      };
      set({
        systemStatus: "FROZEN",
        alertMessage: `⚠️ Suspicious withdrawal detected! ${(pct * 100).toFixed(1)}% of liquidity pool — System FROZEN.`,
        frozenLiquidity: totalLiquidity,
        availableLiquidity: 0,
        liquidityHistory: newLiqHistory,
        txActivity: newTxActivity,
        transactions: [blockedTx, ...transactions].slice(0, 20),
      });
      return false;
    }

    // Normal withdrawal
    const newAvail = availableLiquidity - amount;
    const newTotal = totalLiquidity - amount;
    const label = generateTimeLabel();
    const newLiqHistory: LiquidityPoint[] = [
      ...liquidityHistory.slice(-11),
      { time: label, liquidity: newTotal, locked: newTotal - newAvail },
    ];
    const lastTx = txActivity[txActivity.length - 1];
    const newTxActivity: TxActivityPoint[] = [
      ...txActivity.slice(-11),
      { time: label, deposits: 0, withdrawals: (lastTx?.withdrawals || 0) + 1, attacks: 0 },
    ];
    const newTx: Transaction = {
      id: `tx${Date.now()}`,
      type: "WITHDRAW",
      amount,
      timestamp: new Date(),
      status: "SUCCESS",
      note: "Normal withdrawal",
    };
    set({
      totalLiquidity: newTotal,
      availableLiquidity: newAvail,
      liquidityHistory: newLiqHistory,
      txActivity: newTxActivity,
      transactions: [newTx, ...transactions].slice(0, 20),
    });
    return true;
  },

  simulateAttack: () => {
    const { totalLiquidity, liquidityHistory, txActivity, transactions } = get();
    const label = generateTimeLabel();
    const newLiqHistory: LiquidityPoint[] = [
      ...liquidityHistory.slice(-11),
      { time: label, liquidity: totalLiquidity, locked: totalLiquidity },
    ];
    const lastTx = txActivity[txActivity.length - 1];
    const newTxActivity: TxActivityPoint[] = [
      ...txActivity.slice(-11),
      { time: label, deposits: 0, withdrawals: 0, attacks: (lastTx?.attacks || 0) + 1 },
    ];
    const attackTx: Transaction = {
      id: `tx${Date.now()}`,
      type: "ATTACK",
      timestamp: new Date(),
      status: "ATTACK",
      note: "Flash loan attack simulated — system auto-frozen",
    };
    set({
      systemStatus: "FROZEN",
      alertMessage: "🚨 CRITICAL: Flash loan attack detected! Liquidity pool automatically FROZEN.",
      frozenLiquidity: totalLiquidity,
      availableLiquidity: 0,
      liquidityHistory: newLiqHistory,
      txActivity: newTxActivity,
      transactions: [attackTx, ...transactions].slice(0, 20),
    });
  },

  unfreeze: () => {
    const { totalLiquidity, frozenLiquidity, liquidityHistory, txActivity, transactions } = get();
    const label = generateTimeLabel();
    const avail = totalLiquidity;
    const newLiqHistory: LiquidityPoint[] = [
      ...liquidityHistory.slice(-11),
      { time: label, liquidity: avail, locked: 0 },
    ];
    const lastTx = txActivity[txActivity.length - 1];
    const newTxActivity: TxActivityPoint[] = [
      ...txActivity.slice(-11),
      { time: label, deposits: 0, withdrawals: 0, attacks: 0 },
    ];
    const unfreezeTx: Transaction = {
      id: `tx${Date.now()}`,
      type: "UNFREEZE",
      timestamp: new Date(),
      status: "SUCCESS",
      note: "Admin unfreeze — system restored to NORMAL",
    };
    set({
      systemStatus: "NORMAL",
      alertMessage: "✅ System unfrozen by admin. All operations resumed.",
      availableLiquidity: avail,
      frozenLiquidity: 0,
      liquidityHistory: newLiqHistory,
      txActivity: newTxActivity,
      transactions: [unfreezeTx, ...transactions].slice(0, 20),
    });
  },
}));
