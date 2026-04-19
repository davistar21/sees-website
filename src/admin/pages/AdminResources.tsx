import { useEffect, useState } from "react";
import { supabase, type Resource } from "../../lib/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Field,
  Modal,
  ModalActions,
  inputClass,
} from "../components/FormField";

type ResourceForm = Omit<Resource, "id" | "created_at">;

const blank: ResourceForm = {
  title: "",
  type: "lesson_notes",
  url: "",
  level: null,
};

const typeLabels: Record<Resource["type"], string> = {
  lesson_notes: "Lesson Notes",
  youtube: "YouTube Link",
  tutorial: "Tutorial Video",
  textbook: "Textbook",
};

const levelOptions = [null, 100, 200, 300, 400, 500];

const AdminResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState<ResourceForm>(blank);
  const [saving, setSaving] = useState(false);

  const fetchResources = async () => {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });
    setResources(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setModalOpen(true);
  };

  const openEdit = (resource: Resource) => {
    setEditing(resource);
    setForm({
      title: resource.title,
      type: resource.type,
      url: resource.url ?? "",
      level: resource.level,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await supabase.from("resources").update(form).eq("id", editing.id);
    } else {
      await supabase.from("resources").insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    fetchResources();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource?")) return;
    await supabase.from("resources").delete().eq("id", id);
    fetchResources();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Resources</h2>
          <p className="text-sm text-gray-500">{resources.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={16} /> Add Resource
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : resources.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No resources yet. Add your first one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  Level
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.map((resource) => (
                <tr
                  key={resource.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="truncate max-w-[200px]">{resource.title}</div>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-swamp hover:underline truncate block max-w-[200px]"
                      >
                        {resource.url}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {typeLabels[resource.type]}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {resource.level ? `${resource.level} Level` : "All levels"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(resource)}
                        className="p-1.5 text-gray-400 hover:text-swamp transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
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
          title={editing ? "Edit Resource" : "New Resource"}
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
            <Field label="Type" required>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as Resource["type"],
                  }))
                }
              >
                <option value="lesson_notes">Lesson Notes</option>
                <option value="youtube">YouTube Link</option>
                <option value="tutorial">Tutorial Video</option>
                <option value="textbook">Textbook</option>
              </select>
            </Field>
            <Field label="URL / Link">
              <input
                className={inputClass}
                value={form.url ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                placeholder="https://"
              />
            </Field>
            <Field label="Level (optional)">
              <select
                className={inputClass}
                value={form.level ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    level: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
              >
                {levelOptions.map((lvl) => (
                  <option key={lvl ?? "all"} value={lvl ?? ""}>
                    {lvl ? `${lvl} Level` : "All levels"}
                  </option>
                ))}
              </select>
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

export default AdminResources;
