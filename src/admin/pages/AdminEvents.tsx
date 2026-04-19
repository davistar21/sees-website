import { useEffect, useState } from "react";
import { supabase, type DBEvent } from "../../lib/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Field,
  Modal,
  ModalActions,
  inputClass,
} from "../components/FormField";

type EventForm = Omit<DBEvent, "id" | "created_at">;

const blank: EventForm = {
  title: "",
  description: "",
  image_url: "",
  location: "",
  event_time: "",
  event_date: "",
  category: "Corporate events",
  is_featured: false,
};

const AdminEvents = () => {
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DBEvent | null>(null);
  const [form, setForm] = useState<EventForm>(blank);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (event: DBEvent) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description ?? "",
      image_url: event.image_url ?? "",
      location: event.location ?? "",
      event_time: event.event_time ?? "",
      event_date: event.event_date ?? "",
      category: event.category,
      is_featured: event.is_featured,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null;
    const ext = imageFile.name.split(".").pop();
    const path = `events/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("images")
      .upload(path, imageFile);
    if (error) return form.image_url || null;
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const image_url = await uploadImage();
    const payload = { ...form, image_url };
    if (editing) {
      await supabase.from("events").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("events").insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
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
          <div className="p-8 text-center text-gray-400">
            No events yet. Create your first one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  Location
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      {event.image_url && (
                        <img
                          src={event.image_url}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <span className="truncate max-w-[180px]">
                        {event.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {event.category}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {event.event_date ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {event.location ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(event)}
                        className="p-1.5 text-gray-400 hover:text-swamp transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
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
          title={editing ? "Edit Event" : "New Event"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title" required>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Description">
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.event_date ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, event_date: e.target.value }))
                  }
                />
              </Field>
              <Field label="Time">
                <input
                  type="time"
                  className={inputClass}
                  value={form.event_time ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, event_time: e.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="Location">
              <input
                className={inputClass}
                value={form.location ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </Field>
            <Field label="Category">
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                <option>Corporate events</option>
                <option>Sport events</option>
                <option>Fun events</option>
              </select>
            </Field>
            <Field label="Image">
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] ?? null)
                }
              />
              {form.image_url && !imageFile && (
                <img
                  src={form.image_url}
                  alt=""
                  className="mt-2 h-20 rounded-lg object-cover"
                />
              )}
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_featured: e.target.checked }))
                }
              />
              Feature this event on homepage
            </label>
            <ModalActions
              onCancel={() => setModalOpen(false)}
              saving={saving}
              editing={!!editing}
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminEvents;
