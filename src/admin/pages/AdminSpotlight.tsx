import { useEffect, useState } from "react";
import { supabase, type SpotlightPerson } from "../../lib/supabase";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Field, Modal, ModalActions, inputClass } from "../components/FormField";

const MAX_PHOTO_MB = 5;

type SpotlightForm = Omit<SpotlightPerson, "id" | "created_at">;

const blank: SpotlightForm = {
  name: "",
  role: "",
  category: "Student",
  image_url: "",
  quote: "",
  bio: "",
  linkedin_url: "",
  instagram_url: "",
  display_order: 0,
  active: true,
};

const AdminSpotlight = () => {
  const [people, setPeople] = useState<SpotlightPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SpotlightPerson | null>(null);
  const [form, setForm] = useState<SpotlightForm>(blank);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fileError, setFileError] = useState("");

  const fetchPeople = async () => {
    const { data } = await supabase
      .from("spotlight")
      .select("*")
      .order("display_order", { ascending: true });
    setPeople(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPeople(); }, []);

  const pickPhoto = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setFileError(`Photo must be under ${MAX_PHOTO_MB} MB (selected: ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }
    setFileError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setImageFile(null);
    setImagePreview("");
    setFileError("");
    setSaveError("");
    setModalOpen(true);
  };

  const openEdit = (person: SpotlightPerson) => {
    setEditing(person);
    setForm({
      name: person.name,
      role: person.role,
      category: person.category,
      image_url: person.image_url ?? "",
      quote: person.quote ?? "",
      bio: person.bio ?? "",
      linkedin_url: person.linkedin_url ?? "",
      instagram_url: person.instagram_url ?? "",
      display_order: person.display_order,
      active: person.active,
    });
    setImageFile(null);
    setImagePreview(person.image_url ?? "");
    setFileError("");
    setSaveError("");
    setModalOpen(true);
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null;
    const ext = imageFile.name.split(".").pop();
    const path = `spotlight/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, imageFile);
    if (error) return form.image_url || null;
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) return;
    setSaving(true);
    setSaveError("");
    const image_url = await uploadPhoto();
    const payload = {
      name: form.name,
      role: form.role,
      category: form.category,
      image_url,
      quote: form.quote || null,
      bio: form.bio || null,
      linkedin_url: form.linkedin_url || null,
      instagram_url: form.instagram_url || null,
      display_order: form.display_order,
      active: form.active,
    };

    let dbError: string | null = null;
    if (editing) {
      const { error } = await supabase.from("spotlight").update(payload).eq("id", editing.id);
      if (error) dbError = error.message;
    } else {
      const { error } = await supabase.from("spotlight").insert(payload);
      if (error) dbError = error.message;
    }

    setSaving(false);
    if (dbError) { setSaveError(dbError); return; }
    setModalOpen(false);
    fetchPeople();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this spotlight entry?")) return;
    await supabase.from("spotlight").delete().eq("id", id);
    fetchPeople();
  };

  const toggleActive = async (person: SpotlightPerson) => {
    await supabase.from("spotlight").update({ active: !person.active }).eq("id", person.id);
    fetchPeople();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alumni &amp; Student Spotlight</h2>
          <p className="text-sm text-gray-500">{people.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={16} /> Add Person
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : people.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No spotlight entries yet. Add your first one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Person</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {people.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      {person.image_url ? (
                        <img src={person.image_url} alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-swamp/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-swamp text-xs font-bold">{person.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="truncate max-w-[140px]">{person.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{person.category}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell truncate max-w-[160px]">{person.role}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(person)}
                      className={`transition-colors ${person.active ? "text-swamp" : "text-gray-300"}`}
                    >
                      {person.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(person)} className="p-1.5 text-gray-400 hover:text-swamp transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(person.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
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
        <Modal title={editing ? "Edit Spotlight Entry" : "New Spotlight Entry"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="e.g. Adetola Adeyemi"
                />
              </Field>
              <Field label="Category">
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option>Student</option>
                  <option>Alumni</option>
                </select>
              </Field>
            </div>

            <Field label="Role / Year / Position" required>
              <input
                className={inputClass}
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                required
                placeholder="e.g. Class of 2023 · Software Engineer at Google"
              />
            </Field>

            <Field label={`Photo (max ${MAX_PHOTO_MB} MB)`}>
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) => pickPhoto(e.target.files?.[0])}
              />
              {fileError
                ? <p className="text-xs text-red-600 mt-1">{fileError}</p>
                : <p className="text-xs text-gray-400 mt-1">A portrait photo works best</p>
              }
              {imagePreview && (
                <img src={imagePreview} alt="" loading="lazy" className="mt-2 h-20 w-20 rounded-xl object-cover" />
              )}
            </Field>

            <Field label="Short Quote">
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={form.quote ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                placeholder="A short inspiring quote shown on their card..."
              />
            </Field>

            <Field label="Bio / Full Story">
              <textarea
                className={`${inputClass} resize-none`}
                rows={4}
                value={form.bio ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Full bio shown when someone clicks on their card..."
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="LinkedIn URL">
                <input
                  className={inputClass}
                  value={form.linkedin_url ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>
              <Field label="Instagram URL">
                <input
                  className={inputClass}
                  value={form.instagram_url ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, instagram_url: e.target.value }))}
                  placeholder="https://instagram.com/..."
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Display Order">
                <input
                  type="number"
                  className={inputClass}
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Show on homepage
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

export default AdminSpotlight;