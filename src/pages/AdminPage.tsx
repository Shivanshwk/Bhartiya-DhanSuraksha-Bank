import { useBankContext } from "@/context/BankContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Landmark, ArrowRightLeft } from "lucide-react";

const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

const AdminPage = () => {
  const { user, allUsers, allAccounts, transactions } = useBankContext();
  const navigate = useNavigate();

  if (!user?.isAdmin) {
    navigate("/dashboard");
    return null;
  }

  const totalBalance = allAccounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-bold mb-8 text-foreground">
          Admin <span className="text-gradient-gold">Panel</span>
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-gold/20">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full gradient-gold flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="font-display text-2xl font-bold text-foreground">{allUsers.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gold/20">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full gradient-gold flex items-center justify-center">
                <Landmark className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="font-display text-2xl font-bold text-foreground">{allAccounts.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gold/20">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full gradient-gold flex items-center justify-center">
                <ArrowRightLeft className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Deposits</p>
                <p className="font-display text-2xl font-bold text-foreground">{formatINR(totalBalance)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="font-display">Registered Users</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((u) => (
                  <TableRow key={u.email}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.isAdmin ? <span className="text-saffron font-semibold">Admin</span> : "User"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* All Accounts */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="font-display">All Accounts</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account No.</TableHead>
                  <TableHead>Holder</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAccounts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-sm">{a.accountNumber}</TableCell>
                    <TableCell>{a.holderName}</TableCell>
                    <TableCell className="uppercase text-xs">{a.type}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell className="text-right font-semibold">{formatINR(a.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader><CardTitle className="font-display">Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No transactions yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 20).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-sm">{new Date(t.date).toLocaleString("en-IN")}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell className="uppercase text-xs">{t.type}</TableCell>
                      <TableCell className={`text-right font-semibold ${t.type === "deposit" || t.type === "transfer-in" ? "text-success" : "text-destructive"}`}>
                        {formatINR(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
