'use client';

import { ChevronUp } from 'lucide-react';
import { useEffect } from 'react';

export default function BackUpTop() {
  useEffect(() => {
    const backUpTop = document.getElementById('back-up-top');

    window.addEventListener('scroll', () => {
      setTimeout(() => {
        backUpTop && backUpTop.classList.add('opacity-0');
      }, 20);
    });
  }, []);

  return (
    <button className="fixed max-w-3 max-h-3 average-transition animate-bounce bottom-1 right-1 mx-12 md:px-18 lg:mx-24 xl:mx-[200px] my-12 hover:opacity-100">
      <ChevronUp
        onClick={() => {
          window.location.href = '#';
        }}
        id="back-up-top"
        className="average-transition hover:opacity-100 hover:scale-150"
      />
    </button>
  );
}
