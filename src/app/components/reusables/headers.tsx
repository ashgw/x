import React from 'react';

type HeaderProps = {
  children: React.ReactNode;
  id?: string;
};
export function Heading1({ children, id }: HeaderProps) {
  return (
    <h1 id={id} className="font-bold my-2 text-[2.5rem]">
      {children}
    </h1>
  );
}
export function Heading2({ children, id }: HeaderProps) {
  return (
    <h2 id={id} className="text-3xl font-extrabold dimmed-5">
      {children}
    </h2>
  );
}
export function Heading3({ children, id }: HeaderProps) {
  return (
    <h3 id={id} className="text-2xl font-extrabold dimmed-4">
      {children}
    </h3>
  );
}
