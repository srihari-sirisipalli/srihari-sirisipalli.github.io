import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds: string[], offset = 80) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + offset + 10;

      // Find which section we're currently in
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollY >= top) {
            current = id;
          }
        }
      }

      // Clear active if at the very top (hero section)
      if (window.scrollY < 200) {
        current = "";
      }

      setActiveId(current);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler(); // run once on mount

    return () => window.removeEventListener("scroll", handler);
  }, [sectionIds, offset]);

  return activeId;
}
