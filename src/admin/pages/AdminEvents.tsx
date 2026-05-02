import { useEffect, useRef, useState } from "react";
import { supabase, type DBEvent, type GalleryImage, type FeaturedVideo } from "../../lib/supabase";
import { Plus, Pencil, Trash2, X, Image, ToggleLeft, ToggleRight } from "lucide-react";
import {
  Field,
  Modal,
  ModalActions,
  inputClass,
} from "../components/FormField";

const MAX_EVENT_MB = 8;

const sizeError = (file: File) =>
  file.size > MAX_EVENT_MB * 1024 * 1024
    ? `Image must be under ${MAX_EVENT_MB} MB (selected: ${(file.size / 1024 / 1024).toFixed(1)} MB)`
    : "";

type GallerySlot = {
  url: string;
  description: string;
  file?: File;
  preview?: string;
  error?: string;
};

type EventForm = Omit<DBEvent, "id" | "created_at" | "gallery_images" | "youtube_url"> & {
  gallery_images: GallerySlot[];
};

const blank: EventForm = {
  title: "",
  description: "",
  image_url: "",
  location: "",
  event_time: "",
  event_date: "",
  category: "Corporate events",
  is_featured: false,
  gallery_images: [],
};

const AdminEvents = () => {
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DBEvent | null>(null);
  const [form, setForm] = useState<EventForm>(blank);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState("");
  const [mainFileError, setMainFileError] = useState("");
  const galleryRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setMainImageFile(null);
    setMainPreview("");
    setMainFileError("");
    setSaveError("");
    setModalOpen(true);
  };

  const openEdit = (event: DBEvent) => {
    setEditing(event);
    const slots: GallerySlot[] = (event.gallery_images ?? []).map((g) => ({
      url: g.url,
      description: g.description,
    }));
    setForm({
      title: event.title,
      description: event.description ?? "",
      image_url: event.image_url ?? "",
      location: event.location ?? "",
      event_time: event.event_time ?? "",
      event_date: event.event_date ?? "",
      category: event.category,
      is_featured: event.is_featured,
      gallery_images: slots,
    });
    setMainImageFile(null);
    setMainPreview(event.image_url ?? "");
    setMainFileError("");
    setSaveError("");
    setModalOpen(true);
  };

  const pickMainImage = (file: File | undefined) => {
    if (!file) return;
    const err = sizeError(file);
    if (err) { setMainFileError(err); return; }
    setMainFileError("");
    setMainImageFile(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const pickGalleryFile = (index: number, file: File | undefined) => {
    if (!file) return;
    const err = sizeError(file);
    updateGallerySlot(index, err
      ? { error: err }
      : { file, preview: URL.createObjectURL(file), error: "" }
    );
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mainFileError) return;
    if (form.gallery_images.some((s) => s.error)) return;
    setSaving(true);
    setSaveError("");

    let image_url = form.image_url || null;
    if (mainImageFile) image_url = await uploadFile(mainImageFile, "events");

    const gallery_images: GalleryImage[] = [];
    for (const slot of form.gallery_images) {
      if (slot.file) {
        const url = await uploadFile(slot.file, "events/gallery");
        if (url) gallery_images.push({ url, description: slot.description });
      } else if (slot.url) {
        gallery_images.push({ url: slot.url, description: slot.description });
      }
    }

    const payload = {
      title: form.title,
      description: form.description,
      image_url,
      location: form.location,
      event_time: form.event_time,
      event_date: form.event_date,
      category: form.category,
      is_featured: form.is_featured,
      gallery_images,
    };

    let dbError: string | null = null;
    if (editing) {
      const { error } = await supabase.from("events").update(payload).eq("id", editing.id);
      if (error) dbError = error.message;
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) dbError = error.message;
    }

    setSaving(false);
    if (dbError) { setSaveError(dbError); return; }
    setModalOpen(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  const addGallerySlot = () => {
    if (form.gallery_images.length >= 15) return;
    setForm((f) => ({ ...f, gallery_images: [...f.gallery_images, { url: "", description: "" }] }));
  };

  const removeGallerySlot = (index: number) => {
    setForm((f) => ({ ...f, gallery_images: f.gallery_images.filter((_, i) => i !== index) }));
  };

  const updateGallerySlot = (index: number, patch: Partial<GallerySlot>) => {
    setForm((f) => ({
      ...f,
      gallery_images: f.gallery_images.map((slot, i) => i === index ? { ...slot, ...patch } : slot),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Events</h2>
          <p className="text-sm text-gray-500">{events.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No events yet. Create your first one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Location</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      {event.image_url && (
                        <img src={event.image_url} alt="" loading="lazy" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <span className="truncate max-w-[180px]">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{event.category}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{event.event_date ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{event.location ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(event)} className="p-1.5 text-gray-400 hover:text-swamp transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
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
        <Modal title={editing ? "Edit Event" : "New Event"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title" required>
              <input className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </Field>

            <Field label="Description">
              <textarea className={`${inputClass} resize-none`} rows={3} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                <input type="date" className={inputClass} value={form.event_date ?? ""} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))} />
              </Field>
              <Field label="Time">
                <input type="time" className={inputClass} value={form.event_time ?? ""} onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))} />
              </Field>
            </div>

            <Field label="Location">
              <input className={inputClass} value={form.location ?? ""} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </Field>

            <Field label="Category">
              <select className={inputClass} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                <option>Corporate events</option>
                <option>Sport events</option>
                <option>Fun events</option>
              </select>
            </Field>

            <Field label={`Main Image (max ${MAX_EVENT_MB} MB)`}>
              <input type="file" accept="image/*" className={inputClass} onChange={(e) => pickMainImage(e.target.files?.[0])} />
              {mainFileError && <p className="text-xs text-red-600 mt-1">{mainFileError}</p>}
              {(mainPreview || form.image_url) && (
                <img src={mainPreview || form.image_url || ""} alt="" loading="lazy" className="mt-2 h-20 rounded-lg object-cover" />
              )}
            </Field>

            {/* Gallery Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gallery Images <span className="text-gray-400 font-normal">({form.gallery_images.length}/15)</span>
                </label>
                {form.gallery_images.length < 15 && (
                  <button type="button" onClick={addGallerySlot} className="flex items-center gap-1 text-xs text-swamp font-medium hover:opacity-70">
                    <Plus size={13} /> Add image
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {form.gallery_images.map((slot, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Image {i + 1} (max {MAX_EVENT_MB} MB)</span>
                      <button type="button" onClick={() => removeGallerySlot(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {(slot.preview || slot.url) ? (
                        <img src={slot.preview || slot.url} alt="" loading="lazy" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Image size={20} className="text-gray-300" />
                        </div>
                      )}
                      <input
                        ref={(el) => { galleryRefs.current[i] = el; }}
                        type="file"
                        accept="image/*"
                        className={`${inputClass} text-xs`}
                        onChange={(e) => pickGalleryFile(i, e.target.files?.[0])}
                      />
                    </div>
                    {slot.error && <p className="text-xs text-red-600">{slot.error}</p>}

                    <input
                      className={`${inputClass} text-xs`}
                      placeholder="Caption / description..."
                      value={slot.description}
                      onChange={(e) => updateGallerySlot(i, { description: e.target.value })}
                    />
                  </div>
                ))}

                {form.gallery_images.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-xl">
                    No gallery images yet. Click "Add image" to upload up to 15.
                  </p>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />
              Feature this event on homepage (countdown timer)
            </label>

            {saveError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{saveError}</p>
            )}

            <ModalActions onCancel={() => setModalOpen(false)} saving={saving} editing={!!editing} />
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── Featured Video ───────────────────────────────────────────────────────────

type VideoForm = Omit<FeaturedVideo, "id" | "created_at">;

const blankVideo: VideoForm = {
  title: "",
  youtube_url: "",
  description: "",
  location: "",
  event_date: "",
  event_time: "",
  active: true,
};

const FeaturedVideos = () => {
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FeaturedVideo | null>(null);
  const [form, setForm] = useState<VideoForm>(blankVideo);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fetchVideos = async () => {
    const { data } = await supabase
      .from("featured_video")
      .select("*")
      .order("created_at", { ascending: false });
    setVideos(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchVideos(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blankVideo);
    setSaveError("");
    setModalOpen(true);
  };

  const openEdit = (v: FeaturedVideo) => {
    setEditing(v);
    setForm({
      title: v.title,
      youtube_url: v.youtube_url,
      description: v.description ?? "",
      location: v.location ?? "",
      event_date: v.event_date ?? "",
      event_time: v.event_time ?? "",
      active: v.active,
    });
    setSaveError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    const payload = {
      title: form.title,
      youtube_url: form.youtube_url,
      description: form.description || null,
      location: form.location || null,
      event_date: form.event_date || null,
      event_time: form.event_time || null,
      active: form.active,
    };
    let dbError: string | null = null;
    if (editing) {
      const { error } = await supabase.from("featured_video").update(payload).eq("id", editing.id);
      if (error) dbError = error.message;
    } else {
      const { error } = await supabase.from("featured_video").insert(payload);
      if (error) dbError = error.message;
    }
    setSaving(false);
    if (dbError) { setSaveError(dbError); return; }
    setModalOpen(false);
    fetchVideos();
  };

  const toggleActive = async (v: FeaturedVideo) => {
    await supabase.from("featured_video").update({ active: !v.active }).eq("id", v.id);
    fetchVideos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this featured video?")) return;
    await supabase.from("featured_video").delete().eq("id", id);
    fetchVideos();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Featured Video</h3>
          <p className="text-xs text-gray-400">Shown on the Events page. Only active entries are displayed.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={15} /> Add Video
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : videos.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No featured videos yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {videos.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{v.title}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{v.youtube_url}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{v.event_date ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(v)}
                      className={`transition-colors ${v.active ? "text-swamp" : "text-gray-300"}`}
                    >
                      {v.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(v)} className="p-1.5 text-gray-400 hover:text-swamp transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
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
        <Modal title={editing ? "Edit Featured Video" : "New Featured Video"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title" required>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                placeholder="e.g. SEES Annual General Meeting 2025"
              />
            </Field>
            <Field label="YouTube URL" required>
              <input
                className={inputClass}
                value={form.youtube_url}
                onChange={(e) => setForm((f) => ({ ...f, youtube_url: e.target.value }))}
                required
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-400 mt-1">Paste any YouTube link — the embed is handled automatically.</p>
            </Field>
            <Field label="Description">
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description shown below the video..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.event_date ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                />
              </Field>
              <Field label="Time">
                <input
                  type="time"
                  className={inputClass}
                  value={form.event_time ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Location">
              <input
                className={inputClass}
                value={form.location ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Main Auditorium"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Show on Events page
            </label>
            {saveError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{saveError}</p>
            )}
            <ModalActions onCancel={() => setModalOpen(false)} saving={saving} editing={!!editing} />
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── Wrapper ─────────────────────────────────────────────────────────────────

const AdminEventsPage = () => (
  <div className="space-y-8">
    <AdminEvents />
    <FeaturedVideos />
  </div>
);

export default AdminEventsPage;