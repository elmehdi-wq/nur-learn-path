import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Upload, X } from "lucide-react";
import {
  fileToDataUrl,
  isFileVideo,
  MAX_VIDEO_BYTES,
  normalizeVideoUrl,
} from "@/lib/video";

interface Props {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

/**
 * Combined URL + file input for a lesson video.
 * - Validates and normalizes YouTube / Vimeo / direct mp4 URLs.
 * - Allows uploading a small video file (stored as data URL).
 */
export function VideoInput({ value, onChange, placeholder }: Props) {
  const [raw, setRaw] = useState(value ?? "");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "uploading">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRaw(value ?? "");
    setStatus(value ? "ok" : "idle");
    setError(null);
  }, [value]);

  const commitText = (text: string) => {
    if (!text.trim()) {
      setError(null);
      setStatus("idle");
      onChange(undefined);
      return;
    }
    const res = normalizeVideoUrl(text);
    if (!res.ok) {
      setError(res.message ?? "رابط غير صالح");
      setStatus("idle");
      return;
    }
    setError(null);
    setStatus("ok");
    setRaw(res.url);
    onChange(res.url);
  };

  const handleFile = async (file: File) => {
    setStatus("uploading");
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setRaw(`[ملف فيديو · ${file.name}]`);
      setStatus("ok");
      onChange(dataUrl);
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "فشل رفع الملف");
    }
  };

  const clear = () => {
    setRaw("");
    setError(null);
    setStatus("idle");
    onChange(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const isUploaded = value?.startsWith("data:video/");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={(e) => !isUploaded && commitText(e.target.value)}
          placeholder={placeholder ?? "https://youtube.com/watch?v=… أو رابط mp4"}
          dir="ltr"
          readOnly={isUploaded}
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm text-left ltr"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-xs font-bold hover:bg-primary-soft"
          title="رفع ملف فيديو"
        >
          {status === "uploading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          رفع
        </button>
        {value && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-destructive/30 px-2.5 py-2 text-destructive hover:bg-destructive/10"
            title="إزالة"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
      {!error && status === "ok" && value && (
        <p className="inline-flex items-center gap-1 text-xs font-semibold text-success">
          <CheckCircle2 className="h-3 w-3" />
          {isUploaded
            ? "تم رفع الملف"
            : isFileVideo(value)
              ? "ملف فيديو مباشر"
              : "رابط تضمين صالح"}
        </p>
      )}
      <p className="text-[10px] text-muted-foreground">
        المدعوم: YouTube، Vimeo، أو ملف mp4/webm (حتى{" "}
        {Math.round(MAX_VIDEO_BYTES / 1024 / 1024)}MB).
      </p>
    </div>
  );
}
