"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function GiscusBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement("script");
    scriptElem.src = "https://giscus.app/client.js";
    scriptElem.async = true;
    scriptElem.crossOrigin = "anonymous";

    const giscusAttributes = {
      "data-repo": "Moeum/tech-blog",
      "data-repo-id": "R_kgDOMge0hw",
      "data-category": "Comments",
      "data-category-id": "DIC_kwDOMge0h84CihXP",
      "data-mapping": "pathname",
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "bottom",
      "data-theme": theme,
      "data-lang": "ko"
    };

    Object.entries(giscusAttributes).forEach(([key, value]) => {
      scriptElem.setAttribute(key, value);
    });

    ref.current.appendChild(scriptElem);
  }, [theme]);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (!iframe) return;

    iframe.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app");
  }, [theme]);

  return <section ref={ref} style={{ width: "100%", paddingTop: "50px" }} />;
}
