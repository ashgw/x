'use client';
import React, { useEffect, useRef, useState } from 'react';
import './FadeInView.css';
import SplitLayout from '../x/page';

const FadeInView: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const target = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(!isVisible);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  });

  return (
    <div className="flex items-center justify-center">
      <div ref={target} className={`fade-in ${isVisible ? 'visible' : ''}`}>
        <SplitLayout />
      </div>
      <div className=" max-h-max max-w-max  "></div>
    </div>
  );
};

export default FadeInView;
