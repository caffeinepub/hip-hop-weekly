import { Button } from "@/components/ui/button";
import {
  Eye,
  Globe,
  Inbox,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Music,
  Newspaper,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Rundown Stories", to: "/admin/rundown", icon: Newspaper },
  { label: "Watch List", to: "/admin/watchlist", icon: Eye },
  { label: "Underground", to: "/admin/underground", icon: Globe },
  { label: "Beat Charts", to: "/admin/beats", icon: Music },
  { label: "Producer Tips", to: "/admin/tips", icon: Lightbulb },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Submissions", to: "/admin/submissions", icon: Inbox },
  { label: "Subscribers", to: "/admin/subscribers", icon: Users },
];

export default function AdminLayout() {
  const { actor } = useActor();
  const { identity, login, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .isCallerAdmin()
      .then((result) => {
        setIsAdmin(result);
        if (!result && identity) {
          // logged in but not admin
        }
      })
      .catch(() => setIsAdmin(false));
  }, [actor, identity]);

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-card border border-border rounded-sm p-10">
          <div className="font-display font-black text-gold text-4xl uppercase tracking-tight mb-4">
            ADMIN
          </div>
          <p className="text-muted-foreground mb-6">
            Login with Internet Identity to access the content management panel.
          </p>
          <Button
            onClick={login}
            className="bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest w-full"
          >
            LOGIN WITH INTERNET IDENTITY
          </Button>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-card border border-border rounded-sm p-10">
          <div className="font-display font-black text-crimson text-2xl uppercase tracking-tight mb-4">
            ACCESS DENIED
          </div>
          <p className="text-muted-foreground mb-6">
            Your account does not have admin privileges.
          </p>
          <Button
            onClick={() => {
              clear();
              navigate("/");
            }}
            variant="outline"
            className="border-border text-foreground"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Verifying access...
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="font-display font-black text-gold uppercase text-sm tracking-widest">
            CONTENT MANAGER
          </div>
          <button
            type="button"
            className="md:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="p-2">
          {adminLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-display font-semibold transition-colors mb-0.5 ${
                location.pathname === to
                  ? "bg-gold text-[oklch(0.10_0_0)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button
            onClick={() => {
              clear();
              navigate("/");
            }}
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground font-display font-semibold text-sm"
          >
            <LogOut size={16} className="mr-3" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className="md:hidden fixed bottom-4 right-4 z-50 bg-gold text-[oklch(0.10_0_0)] p-3 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
