import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBankContext } from "@/context/BankContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, CheckCircle2 } from "lucide-react";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const { signup } = useBankContext();
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    toast.success(`Verification OTP sent! (Demo OTP: ${code})`, { duration: 8000 });
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setEmailVerified(true);
      toast.success("Email verified successfully!");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (signup(name, email, password)) {
      toast.success("Account created! Welcome to Bhartiya DhanSuraksha Bank.");
      navigate("/dashboard");
    } else {
      toast.error("Email already registered");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md shadow-gold border-gold/20">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl text-foreground">Create Account</CardTitle>
          <CardDescription>Join Bhartiya DhanSuraksha Bank today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Rajesh Kumar" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailVerified(false);
                    setOtpSent(false);
                    setOtp("");
                  }}
                  required
                  disabled={emailVerified}
                />
                {!emailVerified && (
                  <Button type="button" variant="outline" size="sm" className="shrink-0 border-saffron text-saffron hover:bg-saffron/10" onClick={handleSendOtp}>
                    <Mail className="h-4 w-4 mr-1" />
                    {otpSent ? "Resend" : "Verify"}
                  </Button>
                )}
                {emailVerified && (
                  <div className="flex items-center text-success shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
            {otpSent && !emailVerified && (
              <div className="space-y-2 p-3 rounded-md bg-muted border border-border">
                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <Button type="button" variant="gold" size="sm" className="shrink-0" onClick={handleVerifyOtp}>
                    Confirm
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" variant="gold" className="w-full" size="lg" disabled={!emailVerified}>
              Sign Up
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-saffron font-medium hover:underline">Sign In</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
