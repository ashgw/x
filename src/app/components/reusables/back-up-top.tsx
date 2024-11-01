'use client';

import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BackUpTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      setScrollTimeout(
        setTimeout(() => {
          setIsVisible(false);
        }, 1069)
      );

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, scrollTimeout]);

  return (
    <button
      className={`fixed max-w-3 max-h-3 average-transition animate-bounce bottom-1 right-1 mx-12 md:px-18 lg:mx-24 xl:mx-[200px] my-12 
        ${isVisible ? 'opacity-100 transition-opacity duration-300' : 'opacity-0 transition-opacity duration-300'}`}
    >
      <ChevronUp
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        id="back-up-top"
        className="average-transition hover:opacity-100 hover:scale-150"
      />
    </button>
  );
}
