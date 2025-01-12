'use client';

import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export function TypingAnimation() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'I <span class="glows">design.</span>',
        'I <span class="glows">build.</span>',
        'I <span class="glows">solve</span> software',
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
