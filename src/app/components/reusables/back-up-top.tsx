'use client';

import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BackUpTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isVisible ? (
    <button className="fixed max-w-3 max-h-3 average-transition animate-bounce bottom-1 right-1 mx-12 md:px-18 lg:mx-24 xl:mx-[200px] my-12 hover:opacity-100">
      <ChevronUp
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        id="back-up-top"
        className="average-transition hover:opacity-100 hover:scale-150"
      />
    </button>
  ) : null;
}
