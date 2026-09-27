import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Shield, Landmark, ArrowRightLeft, Calculator } from "lucide-react";

const features = [
  { icon: Landmark, title: "Multiple Accounts", desc: "Open Savings, Current or Fixed Deposit accounts" },
  { icon: ArrowRightLeft, title: "Easy Transfers", desc: "Transfer money instantly between accounts" },
  { icon: Shield, title: "Secure Banking", desc: "Email-authenticated secure transactions" },
  { icon: Calculator, title: "Loan Calculator", desc: "Calculate EMI and interest for your loans" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Bhartiya DhanSuraksha Bank" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent" />
        <div className="relative z-10 container mx-auto px-6 flex flex-col items-start gap-6 max-w-3xl">
          <img src={logo} alt="Logo" className="h-20 w-20 animate-fade-in rounded-full bg-card/90 p-1" />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground leading-tight animate-fade-in">
            Welcome to<br />
            <span className="text-gradient-gold">Bhartiya DhanSuraksha Bank</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Your trusted partner in secure and modern Indian banking. Manage your finances with confidence — all amounts in ₹ (INR).
          </p>
          <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button variant="gold" size="lg" onClick={() => navigate("/signup")}>
              Open an Account
            </Button>
            <Button variant="outline" size="lg" className="border-gold-light text-primary-foreground hover:bg-gold/20" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Our <span className="text-gradient-gold">Services</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="p-6 rounded-lg border border-border bg-background hover:shadow-gold transition-shadow duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-full gradient-gold flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-navy py-8 text-center text-primary-foreground/60 text-sm">
        <p>© 2026 Bhartiya DhanSuraksha Bank. All rights reserved. | RBI Licensed</p>
      </footer>
    </div>
  );
};

export default Landing;
