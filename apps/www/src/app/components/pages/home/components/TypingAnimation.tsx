"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

export function TypingAnimation() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        '<span class="glows">Experiments.</span>',
        '<span class="glows">Findings.</span>',
        '<span class="glows">Me.</span>',
      ],
      typeSpeed: 50,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="dimmed-4">
      <span ref={el} />
    </div>
  );
}
