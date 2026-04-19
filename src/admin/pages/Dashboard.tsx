import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { CalendarDays, Users, BookOpen, Image } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
};

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
    >
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const quickActions = [
  { label: "Add Event", href: "/admin/events" },
  { label: "Add Executive", href: "/admin/executives" },
  { label: "Add Resource", href: "/admin/resources" },
  { label: "Edit Hero", href: "/admin/homepage" },
];

const Dashboard = () => {
  const [counts, setCounts] = useState({
    events: 0,
    executives: 0,
    resources: 0,
    slides: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [events, executives, resources, slides] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase
          .from("executives")
          .select("id", { count: "exact", head: true }),
        supabase.from("resources").select("id", { count: "exact", head: true }),
        supabase
          .from("hero_slides")
          .select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        events: events.count ?? 0,
        executives: executives.count ?? 0,
        resources: resources.count ?? 0,
        slides: slides.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-500 text-sm">Quick summary of your content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Events"
          value={counts.events}
          icon={CalendarDays}
          color="bg-swamp"
        />
        <StatCard
          label="Executives"
          value={counts.executives}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          label="Resources"
          value={counts.resources}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          label="Hero Slides"
          value={counts.slides}
          icon={Image}
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Quick actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className="text-center py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-swamp hover:text-white hover:border-swamp transition-all"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
