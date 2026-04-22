import { useEffect, useState } from "react";
import { supabase, type Executive } from "../../lib/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Field,
  Modal,
  ModalActions,
  inputClass,
} from "../components/FormField";

type ExecForm = Omit<Executive, "id" | "created_at">;

const blank: ExecForm = {
  name: "",
  role: "",
  description: "",
  image_url: "",
  portfolio: "#",
  whatsapp_url: "",
  display_order: 0,
};

const AdminExecutives = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Executive | null>(null);
  const [form, setForm] = useState<ExecForm>(blank);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const MAX_PHOTO_MB = 5;
  const pickPhoto = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setFileError(`Photo must be under ${MAX_PHOTO_MB} MB (selected: ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }
    setFileError("");
    setImageFile(file);
  };

  const fetchExecutives = async () => {
    const { data } = await supabase
      .from("executives")
      .select("*")
      .order("display_order", { ascending: true });
    setExecutives(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExecutives();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (exec: Executive) => {
    setEditing(exec);
    setForm({
      name: exec.name,
      role: exec.role,
      description: exec.description ?? "",
      image_url: exec.image_url ?? "",
      portfolio: exec.portfolio,
      whatsapp_url: exec.whatsapp_url ?? "",
      display_order: exec.display_order,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null;
    const ext = imageFile.name.split(".").pop();
    const path = `executives/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("images")
      .upload(path, imageFile);
    if (error) return form.image_url || null;
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
      await supabase.from("executives").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("executives").insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchExecutives();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this executive?")) return;
    await supabase.from("executives").delete().eq("id", id);
    fetchExecutives();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Executives</h2>
          <p className="text-sm text-gray-500">{executives.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={16} /> Add Executive
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : executives.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No executives yet. Add your first one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  Role
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  Order
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {executives.map((exec) => (
                <tr key={exec.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      {exec.image_url ? (
                        <img
                          src={exec.image_url}
                          alt=""
                          loading="lazy"
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-swamp/20 flex-shrink-0" />
                      )}
                      <span className="truncate max-w-[160px]">{exec.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {exec.role}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {exec.display_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(exec)}
                        className="p-1.5 text-gray-400 hover:text-swamp transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(exec.id)}
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
          title={editing ? "Edit Executive" : "New Executive"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Full Name" required>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Role / Title" required>
              <input
                className={inputClass}
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                required
                placeholder="e.g. President, Secretary"
              />
            </Field>
            <Field label="Bio">
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <Field label="Portfolio URL">
              <input
                className={inputClass}
                value={form.portfolio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, portfolio: e.target.value }))
                }
                placeholder="https://"
              />
            </Field>
            <Field label="WhatsApp Link">
              <input
                className={inputClass}
                value={form.whatsapp_url ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, whatsapp_url: e.target.value }))
                }
                placeholder="https://wa.me/2348012345678"
              />
              <p className="text-xs text-gray-400 mt-1">
                Use the format: https://wa.me/ followed by the number in international format (no + or spaces).
              </p>
            </Field>
            <Field label="Display Order">
              <input
                type="number"
                className={inputClass}
                value={form.display_order}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    display_order: parseInt(e.target.value) || 0,
                  }))
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
              {form.image_url && !imageFile && (
                <img
                  src={form.image_url}
                  alt=""
                  loading="lazy"
                  className="mt-2 h-20 w-20 rounded-full object-cover"
                />
              )}
            </Field>
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

export default AdminExecutives;
