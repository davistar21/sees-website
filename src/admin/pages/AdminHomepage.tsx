import { useEffect, useState } from "react";
import { supabase, type HeroSlide, type Announcement } from "../../lib/supabase";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import {
  Field,
  Modal,
  ModalActions,
  inputClass,
} from "../components/FormField";

// ─── Hero Slides ─────────────────────────────────────────────────────────────

type SlideForm = Omit<HeroSlide, "id" | "created_at">;

const blankSlide: SlideForm = {
  image_url: "",
  title: "",
  subtitle: "",
  display_order: 0,
  active: true,
};

const MAX_SLIDE_MB = 8;

const HeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<SlideForm>(blankSlide);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_SLIDE_MB * 1024 * 1024) {
      setFileError(`Image must be under ${MAX_SLIDE_MB} MB (selected: ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }
    setFileError("");
    setImageFile(file);
  };

  const fetchSlides = async () => {
    const { data } = await supabase
      .from("hero_slides")
      .select("*")
      .order("display_order", { ascending: true });
    setSlides(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blankSlide);
    setImageFile(null);
    setFileError("");
    setModalOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setForm({
      image_url: slide.image_url,
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      display_order: slide.display_order,
      active: slide.active,
    });
    setImageFile(null);
    setFileError("");
    setModalOpen(true);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.image_url;
    const ext = imageFile.name.split(".").pop();
    const path = `hero/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, imageFile);
    if (error) return form.image_url;
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) return;
    setSaving(true);
    const image_url = await uploadImage();
    const payload = { ...form, image_url };
    if (editing) {
      await supabase.from("hero_slides").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("hero_slides").insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchSlides();
  };

  const toggleActive = async (slide: HeroSlide) => {
    await supabase.from("hero_slides").update({ active: !slide.active }).eq("id", slide.id);
    fetchSlides();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    await supabase.from("hero_slides").delete().eq("id", id);
    fetchSlides();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Hero Slides</h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={15} /> Add Slide
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : slides.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No slides yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Slide</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={slide.image_url}
                        alt=""
                        loading="lazy"
                        className="w-12 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[160px]">{slide.title}</p>
                        {slide.subtitle && (
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">{slide.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{slide.display_order}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(slide)}
                      className={`transition-colors ${slide.active ? "text-swamp" : "text-gray-300"}`}
                    >
                      {slide.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(slide)} className="p-1.5 text-gray-400 hover:text-swamp transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(slide.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
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
        <Modal title={editing ? "Edit Slide" : "New Slide"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Slide Title" required>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                placeholder="e.g. Student Initiative Programme"
              />
            </Field>
            <Field label="Subtitle">
              <input
                className={inputClass}
                value={form.subtitle ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="e.g. Theme: The light of the young shall prevail"
              />
            </Field>
            <Field label={`Background Image (max ${MAX_SLIDE_MB} MB)`} required>
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) => pickImage(e.target.files?.[0])}
              />
              {fileError && <p className="text-xs text-red-600 mt-1">{fileError}</p>}
              {form.image_url && !imageFile && (
                <img src={form.image_url} alt="" loading="lazy" className="mt-2 h-20 w-full rounded-lg object-cover" />
              )}
            </Field>
            <Field label="Display Order">
              <input
                type="number"
                className={inputClass}
                value={form.display_order}
                onChange={(e) => setForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Active (visible on homepage)
            </label>
            <ModalActions onCancel={() => setModalOpen(false)} saving={saving} editing={!!editing} />
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── Announcements ────────────────────────────────────────────────────────────

type AnnouncementForm = Omit<Announcement, "id" | "created_at">;

const blankAnnouncement: AnnouncementForm = {
  title: "",
  content: "",
  active: true,
};

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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

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

const AdminHomepage = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-bold text-gray-900">Homepage Content</h2>
      <p className="text-sm text-gray-500">
        Manage hero slides and announcements shown on the homepage
      </p>
    </div>
    <HeroSlides />
    <Announcements />
  </div>
);

export default AdminHomepage;