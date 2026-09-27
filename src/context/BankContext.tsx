import React, { createContext, useContext, useState, useCallback } from "react";

export type AccountType = "savings" | "current" | "fixed-deposit";

export interface Account {
  id: string;
  accountNumber: string;
  holderName: string;
  type: AccountType;
  balance: number;
  createdAt: string;
  email: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: "deposit" | "withdraw" | "transfer-in" | "transfer-out";
  amount: number;
  date: string;
  description: string;
  balanceAfter: number;
}

interface User {
  email: string;
  name: string;
  isAdmin: boolean;
}

interface BankContextType {
  user: User | null;
  accounts: Account[];
  transactions: Transaction[];
  allUsers: User[];
  allAccounts: Account[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  openAccount: (type: AccountType, holderName: string) => Account;
  deposit: (accountId: string, amount: number) => boolean;
  withdraw: (accountId: string, amount: number) => boolean;
  transfer: (fromId: string, toAccountNumber: string, amount: number) => string | null;
  getBalance: (accountId: string) => number;
  getTransactions: (accountId: string) => Transaction[];
}

const BankContext = createContext<BankContextType | null>(null);

export const useBankContext = () => {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBankContext must be inside BankProvider");
  return ctx;
};

const generateAccountNumber = () => {
  return "DS" + Math.random().toString().slice(2, 14).padEnd(12, "0");
};

const generateId = () => Math.random().toString(36).slice(2, 11);

// Pre-seeded data
const ADMIN_EMAIL = "admin@bhartiya-dhansuraksha.in";
const SEED_USERS: { email: string; password: string; name: string; isAdmin: boolean }[] = [
  { email: ADMIN_EMAIL, password: "admin123", name: "Admin", isAdmin: true },
];

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState(SEED_USERS);
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const login = useCallback(
    (email: string, password: string) => {
      const found = users.find((u) => u.email === email && u.password === password);
      if (found) {
        setUser({ email: found.email, name: found.name, isAdmin: found.isAdmin });
        return true;
      }
      return false;
    },
    [users]
  );

  const signup = useCallback(
    (name: string, email: string, password: string) => {
      if (users.find((u) => u.email === email)) return false;
      setUsers((prev) => [...prev, { email, password, name, isAdmin: false }]);
      setUser({ email, name, isAdmin: false });
      return true;
    },
    [users]
  );

  const logout = useCallback(() => setUser(null), []);

  const openAccount = useCallback(
    (type: AccountType, holderName: string): Account => {
      const acc: Account = {
        id: generateId(),
        accountNumber: generateAccountNumber(),
        holderName,
        type,
        balance: 0,
        createdAt: new Date().toISOString(),
        email: user!.email,
      };
      setAccounts((prev) => [...prev, acc]);
      return acc;
    },
    [user]
  );

  const deposit = useCallback(
    (accountId: string, amount: number) => {
      if (amount <= 0) return false;
      setAccounts((prev) =>
        prev.map((a) => (a.id === accountId ? { ...a, balance: a.balance + amount } : a))
      );
      const acc = accounts.find((a) => a.id === accountId);
      setTransactions((prev) => [
        {
          id: generateId(),
          accountId,
          type: "deposit",
          amount,
          date: new Date().toISOString(),
          description: `Deposited ₹${amount.toLocaleString("en-IN")}`,
          balanceAfter: (acc?.balance || 0) + amount,
        },
        ...prev,
      ]);
      return true;
    },
    [accounts]
  );

  const withdraw = useCallback(
    (accountId: string, amount: number) => {
      const acc = accounts.find((a) => a.id === accountId);
      if (!acc || amount <= 0 || acc.balance < amount) return false;
      setAccounts((prev) =>
        prev.map((a) => (a.id === accountId ? { ...a, balance: a.balance - amount } : a))
      );
      setTransactions((prev) => [
        {
          id: generateId(),
          accountId,
          type: "withdraw",
          amount,
          date: new Date().toISOString(),
          description: `Withdrawn ₹${amount.toLocaleString("en-IN")}`,
          balanceAfter: acc.balance - amount,
        },
        ...prev,
      ]);
      return true;
    },
    [accounts]
  );

  const transfer = useCallback(
    (fromId: string, toAccountNumber: string, amount: number): string | null => {
      const from = accounts.find((a) => a.id === fromId);
      const to = accounts.find((a) => a.accountNumber === toAccountNumber);
      if (!from || !to || from.id === to.id) return "Invalid accounts";
      if (amount <= 0) return "Invalid amount";
      if (from.balance < amount) return "Insufficient balance";

      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === from.id) return { ...a, balance: a.balance - amount };
          if (a.id === to.id) return { ...a, balance: a.balance + amount };
          return a;
        })
      );

      const now = new Date().toISOString();
      setTransactions((prev) => [
        {
          id: generateId(),
          accountId: to.id,
          type: "transfer-in",
          amount,
          date: now,
          description: `Received ₹${amount.toLocaleString("en-IN")} from ${from.accountNumber}`,
          balanceAfter: to.balance + amount,
        },
        {
          id: generateId(),
          accountId: from.id,
          type: "transfer-out",
          amount,
          date: now,
          description: `Transferred ₹${amount.toLocaleString("en-IN")} to ${to.accountNumber}`,
          balanceAfter: from.balance - amount,
        },
        ...prev,
      ]);
      return null;
    },
    [accounts]
  );

  const getBalance = useCallback(
    (accountId: string) => accounts.find((a) => a.id === accountId)?.balance ?? 0,
    [accounts]
  );

  const getTransactions = useCallback(
    (accountId: string) => transactions.filter((t) => t.accountId === accountId),
    [transactions]
  );

  const userAccounts = user ? accounts.filter((a) => a.email === user.email) : [];
  const allUsers = users.map((u) => ({ email: u.email, name: u.name, isAdmin: u.isAdmin }));

  return (
    <BankContext.Provider
      value={{
        user,
        accounts: userAccounts,
        transactions,
        allUsers,
        allAccounts: accounts,
        login,
        signup,
        logout,
        openAccount,
        deposit,
        withdraw,
        transfer,
        getBalance,
        getTransactions,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};
