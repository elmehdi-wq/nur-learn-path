// Video URL normalization, validation, and upload helpers.

export type VideoKind = "iframe" | "file" | "invalid";

export interface VideoCheck {
  ok: boolean;
  kind: VideoKind;
  url: string;
  message?: string;
}

const FILE_RE = /\.(mp4|webm|ogg|m4v|mov)(\?.*)?$/i;

export function isFileVideo(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("data:video/")) return true;
  if (url.startsWith("blob:")) return true;
  return FILE_RE.test(url);
}

/** Convert any supported input into a playable URL (iframe embed or media file). */
export function normalizeVideoUrl(input: string): VideoCheck {
  const raw = (input ?? "").trim();
  if (!raw) return { ok: false, kind: "invalid", url: "", message: "الرابط فارغ" };

  // Direct media file or data URL
  if (isFileVideo(raw)) {
    return { ok: true, kind: "file", url: raw };
  }

  // Try URL parse
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { ok: false, kind: "invalid", url: raw, message: "صيغة الرابط غير صحيحة" };
  }

  const host = u.hostname.replace(/^www\./, "").toLowerCase();

  // YouTube
  if (host === "youtu.be") {
    const id = u.pathname.replace(/^\//, "").split("/")[0];
    if (id) return { ok: true, kind: "iframe", url: `https://www.youtube.com/embed/${id}` };
  }
  if (host.endsWith("youtube.com") || host === "youtube-nocookie.com") {
    if (u.pathname.startsWith("/embed/")) {
      return { ok: true, kind: "iframe", url: raw };
    }
    if (u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      if (id) return { ok: true, kind: "iframe", url: `https://www.youtube.com/embed/${id}` };
    }
    if (u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/")[2];
      if (id) return { ok: true, kind: "iframe", url: `https://www.youtube.com/embed/${id}` };
    }
  }

  // Vimeo
  if (host === "vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean)[0];
    if (id && /^\d+$/.test(id)) {
      return { ok: true, kind: "iframe", url: `https://player.vimeo.com/video/${id}` };
    }
  }
  if (host === "player.vimeo.com" && u.pathname.startsWith("/video/")) {
    return { ok: true, kind: "iframe", url: raw };
  }

  return {
    ok: false,
    kind: "invalid",
    url: raw,
    message: "الرابط غير مدعوم. استخدم YouTube أو Vimeo أو ملف فيديو (mp4/webm).",
  };
}

export const MAX_VIDEO_BYTES = 8 * 1024 * 1024; // 8MB (localStorage-safe)

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("video/")) {
      reject(new Error("الملف ليس فيديو."));
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      reject(new Error(`حجم الملف يتجاوز ${Math.round(MAX_VIDEO_BYTES / 1024 / 1024)}MB.`));
      return;
    }
    const r = new FileReader();
    r.onerror = () => reject(new Error("تعذّر قراءة الملف."));
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(file);
  });
}
