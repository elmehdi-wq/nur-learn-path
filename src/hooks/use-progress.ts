import { useEffect, useState } from "react";
import { loadProgress, type ProgressState } from "@/lib/progress";

export function useProgress(): ProgressState {
  const [p, setP] = useState<ProgressState>(() => loadProgress());
  useEffect(() => {
    const update = () => setP(loadProgress());
    update();
    window.addEventListener("nuhba:progress", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("nuhba:progress", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return p;
}
