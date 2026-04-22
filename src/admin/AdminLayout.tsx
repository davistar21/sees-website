import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BookOpen,
  Home,
  Mail,
  LogOut,
  Menu,
  Newspaper,
  UserSquare2,
  UsersRound,
  Star,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Executives", href: "/admin/executives", icon: Users },
  { label: "Teams", href: "/admin/teams", icon: UsersRound },
  { label: "Spotlight", href: "/admin/spotlight", icon: Star },
  { label: "HOD", href: "/admin/hod", icon: UserSquare2 },
  { label: "Resources", href: "/admin/resources", icon: BookOpen },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <img
          src="/sees-logo-white.png"
          alt="SEES"
          loading="eager"
          className="h-10 object-contain"
        />
        <p className="text-white/50 text-xs mt-2 font-semibold tracking-widest uppercase">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white text-swamp"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  const isLoginPage = location.pathname === "/admin/login";

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-swamp flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-swamp flex flex-col flex-shrink-0">
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            className="md:hidden text-gray-600 hover:text-swamp transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h1 className="text-gray-800 font-semibold text-lg">
            {navItems.find((n) => n.href === location.pathname)?.label ??
              "Admin"}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
