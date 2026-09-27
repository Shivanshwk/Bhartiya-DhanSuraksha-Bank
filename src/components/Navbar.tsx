import { Link, useNavigate } from "react-router-dom";
import { useBankContext } from "@/context/BankContext";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Shield } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useBankContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="gradient-navy px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-navy">
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="Bhartiya DhanSuraksha Bank" className="h-10 w-10 rounded-full bg-card p-0.5" />
        <span className="font-display text-lg font-bold text-primary-foreground tracking-wide">
          BHARTIYA DHANSURAKSHA BANK
        </span>
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-navy-light" onClick={() => navigate("/dashboard")}>
              <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
            </Button>
            {user.isAdmin && (
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-navy-light" onClick={() => navigate("/admin")}>
                <Shield className="mr-1 h-4 w-4" /> Admin
              </Button>
            )}
            <span className="text-gold-light text-sm hidden sm:inline">{user.name}</span>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-navy-light" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-navy-light" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button variant="gold" size="sm" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
