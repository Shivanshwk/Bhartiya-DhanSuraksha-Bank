import { useState } from "react";
import { useBankContext, AccountType } from "@/context/BankContext";
import dashboardBg from "@/assets/dashboard-bg.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PlusCircle, ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, Wallet, History, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

const Dashboard = () => {
  const { user, accounts, openAccount, deposit, withdraw, transfer, getTransactions } = useBankContext();
  const navigate = useNavigate();

  const [newAccType, setNewAccType] = useState<AccountType>("savings");
  const [newAccName, setNewAccName] = useState("");

  const [selAcc, setSelAcc] = useState("");
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");

  const [transferFrom, setTransferFrom] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmt, setTransferAmt] = useState("");

  const [historyAcc, setHistoryAcc] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleOpenAccount = () => {
    if (!newAccName.trim()) { toast.error("Enter account holder name"); return; }
    const acc = openAccount(newAccType, newAccName);
    toast.success(`Account ${acc.accountNumber} opened!`);
    setNewAccName("");
  };

  const handleDeposit = () => {
    const amt = parseFloat(depositAmt);
    if (!selAcc || isNaN(amt) || amt <= 0) { toast.error("Enter valid amount"); return; }
    deposit(selAcc, amt);
    toast.success(`Deposited ${formatINR(amt)}`);
    setDepositAmt("");
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmt);
    if (!selAcc || isNaN(amt) || amt <= 0) { toast.error("Enter valid amount"); return; }
    if (!withdraw(selAcc, amt)) { toast.error("Insufficient balance"); return; }
    toast.success(`Withdrawn ${formatINR(amt)}`);
    setWithdrawAmt("");
  };

  const handleTransfer = () => {
    const amt = parseFloat(transferAmt);
    if (!transferFrom || !transferTo || isNaN(amt) || amt <= 0) { toast.error("Fill all fields"); return; }
    const err = transfer(transferFrom, transferTo, amt);
    if (err) { toast.error(err); return; }
    toast.success(`Transferred ${formatINR(amt)}`);
    setTransferAmt("");
    setTransferTo("");
  };

  const txns = historyAcc ? getTransactions(historyAcc) : [];

  return (
    <div className="min-h-[calc(100vh-64px)] relative py-8 px-4">
      <img src={dashboardBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" loading="lazy" width={1920} height={1080} />
      <div className="absolute inset-0 bg-background/80" />
      <div className="container mx-auto max-w-5xl relative z-10">
        <h1 className="font-display text-3xl font-bold mb-2 text-foreground">
          Namaste, <span className="text-gradient-gold">{user.name}</span>
        </h1>
        <p className="text-muted-foreground mb-8">Manage your Bhartiya DhanSuraksha accounts</p>

        {/* Account Cards */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {accounts.map((a) => (
              <Card key={a.id} className="border-gold/20 shadow-gold/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-5 w-5 text-saffron" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{a.type}</span>
                  </div>
                  <p className="font-mono text-sm text-muted-foreground">{a.accountNumber}</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{formatINR(a.balance)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.holderName}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Tabs defaultValue="open" className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1 h-auto bg-muted p-1">
            <TabsTrigger value="open" className="text-xs"><PlusCircle className="h-3 w-3 mr-1" />Open</TabsTrigger>
            <TabsTrigger value="deposit" className="text-xs"><ArrowDownCircle className="h-3 w-3 mr-1" />Deposit</TabsTrigger>
            <TabsTrigger value="withdraw" className="text-xs"><ArrowUpCircle className="h-3 w-3 mr-1" />Withdraw</TabsTrigger>
            <TabsTrigger value="transfer" className="text-xs"><ArrowRightLeft className="h-3 w-3 mr-1" />Transfer</TabsTrigger>
            <TabsTrigger value="history" className="text-xs"><History className="h-3 w-3 mr-1" />History</TabsTrigger>
            <TabsTrigger value="loan" className="text-xs"><Calculator className="h-3 w-3 mr-1" />Loan</TabsTrigger>
          </TabsList>

          {/* Open Account */}
          <TabsContent value="open">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Open New Account</CardTitle>
                <CardDescription>Create a Savings, Current or Fixed Deposit account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Account Holder Name</Label>
                  <Input placeholder="Full name as per Aadhaar" value={newAccName} onChange={(e) => setNewAccName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select value={newAccType} onValueChange={(v) => setNewAccType(v as AccountType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="current">Current Account</SelectItem>
                      <SelectItem value="fixed-deposit">Fixed Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="gold" onClick={handleOpenAccount}>Open Account</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deposit */}
          <TabsContent value="deposit">
            <Card>
              <CardHeader><CardTitle className="font-display">Deposit Money</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Account</Label>
                  <Select value={selAcc} onValueChange={setSelAcc}>
                    <SelectTrigger><SelectValue placeholder="Choose account" /></SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.accountNumber} ({a.type})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" min="1" placeholder="Enter amount" value={depositAmt} onChange={(e) => setDepositAmt(e.target.value)} />
                </div>
                <Button variant="gold" onClick={handleDeposit}>Deposit</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdraw */}
          <TabsContent value="withdraw">
            <Card>
              <CardHeader><CardTitle className="font-display">Withdraw Money</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Account</Label>
                  <Select value={selAcc} onValueChange={setSelAcc}>
                    <SelectTrigger><SelectValue placeholder="Choose account" /></SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.accountNumber} ({a.type}) - {formatINR(a.balance)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" min="1" placeholder="Enter amount" value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)} />
                </div>
                <Button variant="gold" onClick={handleWithdraw}>Withdraw</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfer */}
          <TabsContent value="transfer">
            <Card>
              <CardHeader><CardTitle className="font-display">Transfer Money</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>From Account</Label>
                  <Select value={transferFrom} onValueChange={setTransferFrom}>
                    <SelectTrigger><SelectValue placeholder="Choose account" /></SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.accountNumber} - {formatINR(a.balance)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Account Number</Label>
                  <Input placeholder="e.g. DS123456789012" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" min="1" placeholder="Enter amount" value={transferAmt} onChange={(e) => setTransferAmt(e.target.value)} />
                </div>
                <Button variant="gold" onClick={handleTransfer}>Transfer</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History */}
          <TabsContent value="history">
            <Card>
              <CardHeader><CardTitle className="font-display">Transaction History</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Select value={historyAcc} onValueChange={setHistoryAcc}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.accountNumber} ({a.type})</SelectItem>)}
                  </SelectContent>
                </Select>
                {txns.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">No transactions yet</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {txns.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50 border border-border">
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleString("en-IN")}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${t.type === "deposit" || t.type === "transfer-in" ? "text-success" : "text-destructive"}`}>
                            {t.type === "deposit" || t.type === "transfer-in" ? "+" : "-"}{formatINR(t.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">Bal: {formatINR(t.balanceAfter)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan Calculator */}
          <TabsContent value="loan">
            <LoanCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState<{ emi: number; totalInterest: number; totalAmount: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure) * 12;
    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R <= 0 || N <= 0) {
      toast.error("Enter valid values");
      return;
    }
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalAmount = emi * N;
    setResult({ emi, totalInterest: totalAmount - P, totalAmount });
  };

  const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Loan & EMI Calculator</CardTitle>
        <CardDescription>Calculate your monthly EMI based on RBI standard reducing balance method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Loan Amount (₹)</Label>
            <Input type="number" placeholder="e.g. 500000" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (% p.a.)</Label>
            <Input type="number" step="0.1" placeholder="e.g. 8.5" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tenure (Years)</Label>
            <Input type="number" placeholder="e.g. 5" value={tenure} onChange={(e) => setTenure(e.target.value)} />
          </div>
        </div>
        <Button variant="gold" onClick={calculate}>Calculate EMI</Button>
        {result && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground uppercase">Monthly EMI</p>
              <p className="font-display text-xl font-bold text-foreground">{formatINR(result.emi)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground uppercase">Total Interest</p>
              <p className="font-display text-xl font-bold text-saffron">{formatINR(result.totalInterest)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground uppercase">Total Amount</p>
              <p className="font-display text-xl font-bold text-foreground">{formatINR(result.totalAmount)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
