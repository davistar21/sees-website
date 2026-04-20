import { useEffect, useState } from "react";
import { supabase, type HodProfile } from "../../lib/supabase";
import { Field, inputClass } from "../components/FormField";

const AdminHod = () => {
  const [hod, setHod] = useState<HodProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [saved, setSaved] = useState(false);

  const MAX_PHOTO_MB = 3;
  const pickPhoto = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setFileError(`Photo must be under ${MAX_PHOTO_MB} MB (selected: ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }
    setFileError("");
    setImageFile(file);
  };

  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    image_url: "",
    contact_email: "",
  });

  useEffect(() => {
    supabase
      .from("hod_profile")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setHod(data);
          setForm({
            name: data.name ?? "",
            title: data.title ?? "",
            bio: data.bio ?? "",
            image_url: data.image_url ?? "",
            contact_email: data.contact_email ?? "",
          });
        }
        setLoading(false);
      });
  }, []);

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null;
    const ext = imageFile.name.split(".").pop();
    const path = `hod/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, imageFile);
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

    if (hod) {
      await supabase.from("hod_profile").update(payload).eq("id", hod.id);
    } else {
      await supabase.from("hod_profile").insert(payload);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-swamp border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">HOD Profile</h2>
        <p className="text-sm text-gray-500">
          Manage the Head of Department shown on the homepage
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Current photo preview */}
        {(form.image_url || imageFile) && (
          <div className="mb-6 flex items-center gap-4">
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
              alt="HOD"
              loading="lazy"
              className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
            />
            <div>
              <p className="font-semibold text-gray-800">{form.name || "HOD Name"}</p>
              <p className="text-sm text-gray-500">{form.title || "Title"}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Full Name" required>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="e.g. Prof. Adewale Johnson"
            />
          </Field>

          <Field label="Title / Position">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Professor of Electrical Engineering"
            />
          </Field>

          <Field label="Bio">
            <textarea
              className={`${inputClass} resize-none`}
              rows={5}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Brief description about the HOD..."
            />
          </Field>

          <Field label="Contact Email">
            <input
              type="email"
              className={inputClass}
              value={form.contact_email}
              onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
              placeholder="hod@university.edu.ng"
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
              : <p className="text-xs text-gray-400 mt-1">Upload a new photo to replace the current one</p>
            }
          </Field>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-swamp text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#02543d] disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving..." : hod ? "Update Profile" : "Create Profile"}
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">Saved successfully</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHod;