export function MediumSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="dimmed-5 mx-auto container sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
      {children}
    </section>
  );
}
