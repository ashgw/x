import { Navbar } from '@/app/components/reusables/nav';
import Nav from '@/app/components/nav/nav';
export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav></Nav>
      <main>{children}</main>
    </>
  );
}
