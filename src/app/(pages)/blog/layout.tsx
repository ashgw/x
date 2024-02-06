import { Navbar } from '@/app/components/reusables/nav';

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar></Navbar>
      <main>{children}</main>
    </>
  );
}
