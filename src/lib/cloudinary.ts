const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

/**
 * Rewrites a Cloudinary URL to apply auto quality + format and an optional
 * max width. Non-Cloudinary URLs are returned unchanged.
 */
export function optimizeUrl(url: string | null | undefined, width?: number): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;
  const t = width ? `w_${width},c_limit,q_auto,f_auto` : `q_auto,f_auto`;
  return url.replace("/upload/", `/upload/${t}/`);
}

export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `sees/${folder}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? "Cloudinary upload failed");
  }

  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}
