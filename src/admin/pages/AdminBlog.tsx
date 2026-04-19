import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Field, Modal, ModalActions, inputClass } from "../components/FormField";

export type BlogPost = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  author: string | null;
  published: boolean;
  created_at: string;
};

type PostForm = Omit<BlogPost, "id" | "created_at">;

const blank: PostForm = {
  title: "",
  content: "",
  image_url: "",
  author: "",
  published: false,
};

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<PostForm>(blank);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      content: post.content ?? "",
      image_url: post.image_url ?? "",
      author: post.author ?? "",
      published: post.published,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null;
    const ext = imageFile.name.split(".").pop();
    const path = `blog/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, imageFile);
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
      await supabase.from("blog_posts").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("blog_posts").insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  const togglePublished = async (post: BlogPost) => {
    await supabase
      .from("blog_posts")
      .update({ published: !post.published })
      .eq("id", post.id);
    fetchPosts();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-500">{posts.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-swamp text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#02543d] transition-colors"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No posts yet. Write your first one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <span className="truncate max-w-[180px]">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {post.author ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        post.published
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 text-gray-400 hover:text-swamp transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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
          title={editing ? "Edit Post" : "New Post"}
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
            <Field label="Author">
              <input
                className={inputClass}
                value={form.author ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="e.g. SEES Team"
              />
            </Field>
            <Field label="Cover Image">
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              {form.image_url && !imageFile && (
                <img src={form.image_url} alt="" className="mt-2 h-20 w-full rounded-lg object-cover" />
              )}
            </Field>
            <Field label="Content">
              <textarea
                className={`${inputClass} resize-none`}
                rows={8}
                value={form.content ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your post content here..."
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              />
              Publish immediately
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

export default AdminBlog;