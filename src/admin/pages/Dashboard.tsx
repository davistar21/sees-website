import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type Announcement } from "../../lib/supabase";
import {
  CalendarDays,
  Users,
  BookOpen,
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  UserSquare2,
} from "lucide-react";
import { Field, Modal, ModalActions, inputClass } from "../components/FormField";

// ─── Stat card ───────────────────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
};

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

// ─── Quick actions ────────────────────────────────────────────────────────────

const quickActions = [
  { label: "Add Event", href: "/admin/events", icon: CalendarDays },
  { label: "Add Executive", href: "/admin/executives", icon: Users },
  { label: "Add Resource", href: "/admin/resources", icon: BookOpen },
  { label: "Add Blog Post", href: "/admin/blog", icon: Newspaper },
  { label: "Add Team Member", href: "/admin/teams", icon: UserSquare2 },
];

// ─── Announcements ────────────────────────────────────────────────────────────

type AnnouncementForm = Omit<Announcement, "id" | "created_at">;

const blankAnnouncement: AnnouncementForm = { title: "", content: "", active: true };

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(blankAnnouncement);
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setAnnouncements(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blankAnnouncement);
    setModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({ title: a.title, content: a.content ?? "", active: a.active });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await supabase.from("announcements").update(form).eq("id", editing.id);
    } else {
      await supabase.from("announcements").insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    fetchAnnouncements();
  };

  const toggleActive = async (a: Announcement) => {
    await supabase.from("announcements").update({ active: !a.active }).eq("id", a.id);
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    fetchAnnouncements();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Announcements</h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={15} /> Add Announcement
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No announcements yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {announcements.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{a.title}</p>
                    {a.content && (
                      <p className="text-xs text-gray-400 truncate max-w-[240px]">{a.content}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(a)}
                      className={`transition-colors ${a.active ? "text-swamp" : "text-gray-300"}`}
                    >
                      {a.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(a)} className="p-1.5 text-gray-400 hover:text-swamp transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal
          title={editing ? "Edit Announcement" : "New Announcement"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title" required>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </Field>
            <Field label="Content">
              <textarea
                className={`${inputClass} resize-none`}
                rows={4}
                value={form.content ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Show on site
            </label>
            <ModalActions onCancel={() => setModalOpen(false)} saving={saving} editing={!!editing} />
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [counts, setCounts] = useState({
    events: 0,
    executives: 0,
    resources: 0,
    posts: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [events, executives, resources, posts] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("executives").select("id", { count: "exact", head: true }),
        supabase.from("resources").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        events: events.count ?? 0,
        executives: executives.count ?? 0,
        resources: resources.count ?? 0,
        posts: posts.count ?? 0,
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
        <StatCard label="Events" value={counts.events} icon={CalendarDays} color="bg-swamp" />
        <StatCard label="Executives" value={counts.executives} icon={Users} color="bg-blue-500" />
        <StatCard label="Resources" value={counts.resources} icon={BookOpen} color="bg-purple-500" />
        <StatCard label="Blog Posts" value={counts.posts} icon={Newspaper} color="bg-orange-500" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Quick actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className="flex flex-col items-center gap-2 py-4 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-swamp hover:text-white hover:border-swamp transition-all"
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <Announcements />
    </div>
  );
};

export default Dashboard;
