import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Field,
  Modal,
  ModalActions,
  inputClass,
} from "../components/FormField";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string | null;
  image_url: string | null;
  portfolio: string;
  category: string;
  display_order: number;
  created_at: string;
};

type MemberForm = Omit<TeamMember, "id" | "created_at">;

const blank: MemberForm = {
  name: "",
  role: "",
  description: "",
  image_url: "",
  portfolio: "#",
  category: "",
  display_order: 0,
};

const AdminTeams = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<MemberForm>(blank);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [fileError, setFileError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const MAX_PHOTO_MB = 3;
  const pickPhoto = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setFileError(`Photo must be under ${MAX_PHOTO_MB} MB (selected: ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }
    setFileError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Derived list of existing category names for the datalist autocomplete
  const categories = Array.from(new Set(members.map((m) => m.category))).filter(Boolean);

  const fetch = async () => {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("category")
      .order("display_order", { ascending: true });
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setImageFile(null);
    setPreview("");
    setSaveError("");
    setModalOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      name: m.name,
      role: m.role,
      description: m.description ?? "",
      image_url: m.image_url ?? "",
      portfolio: m.portfolio,
      category: m.category,
      display_order: m.display_order,
    });
    setImageFile(null);
    setPreview(m.image_url ?? "");
    setSaveError("");
    setModalOpen(true);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null;
    const ext = imageFile.name.split(".").pop();
    const path = `teams/${Date.now()}.${ext}`;
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

    const image_url = await uploadImage();
    const payload = { ...form, image_url };

    let err: string | null = null;
    if (editing) {
      const { error } = await supabase.from("team_members").update(payload).eq("id", editing.id);
      if (error) err = error.message;
    } else {
      const { error } = await supabase.from("team_members").insert(payload);
      if (error) err = error.message;
    }

    setSaving(false);
    if (err) { setSaveError(err); return; }
    setModalOpen(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    fetch();
  };

  // Group members by category for the table
  const grouped = members.reduce<Record<string, TeamMember[]>>((acc, m) => {
    const cat = m.category || "Uncategorised";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Teams</h2>
          <p className="text-sm text-gray-500">{members.length} members across {Object.keys(grouped).length} categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading...</div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">
          No team members yet. Add your first one.
        </div>
      ) : (
        Object.entries(grouped).map(([category, group]) => (
          <div key={category} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-[#e8fff7] border-b border-gray-200">
              <h3 className="font-semibold text-swamp text-sm">{category}</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Order</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {group.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        {m.image_url && (
                          <img
                            src={m.image_url}
                            alt=""
                            loading="lazy"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <span className="truncate max-w-[160px]">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{m.role}</td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{m.display_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-1.5 text-gray-400 hover:text-swamp transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
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
          </div>
        ))
      )}

      {modalOpen && (
        <Modal
          title={editing ? "Edit Team Member" : "New Team Member"}
          onClose={() => setModalOpen(false)}
        >
          {/* Datalist for category suggestions */}
          <datalist id="category-list">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Name" required>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </Field>

            <Field label="Role" required>
              <input
                className={inputClass}
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                required
              />
            </Field>

            <Field label="Category">
              <input
                className={inputClass}
                list="category-list"
                placeholder="e.g. Meet The Developers"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
              <p className="text-xs text-gray-400 mt-1">
                Type a new category or pick an existing one. Members with the same category are grouped together on the page.
              </p>
            </Field>

            <Field label="Description">
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>

            <Field label="Portfolio URL">
              <input
                className={inputClass}
                placeholder="https://..."
                value={form.portfolio}
                onChange={(e) => setForm((f) => ({ ...f, portfolio: e.target.value }))}
              />
            </Field>

            <Field label="Display Order">
              <input
                type="number"
                className={inputClass}
                value={form.display_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, display_order: Number(e.target.value) }))
                }
              />
            </Field>

            <Field label={`Photo (max ${MAX_PHOTO_MB} MB)`}>
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) => pickPhoto(e.target.files?.[0])}
              />
              {fileError && (
                <p className="text-xs text-red-600 mt-1">{fileError}</p>
              )}
              {preview && (
                <img
                  src={preview}
                  alt=""
                  loading="lazy"
                  className="mt-2 h-20 w-20 rounded-full object-cover"
                />
              )}
            </Field>

            {saveError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {saveError}
              </p>
            )}

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

export default AdminTeams;