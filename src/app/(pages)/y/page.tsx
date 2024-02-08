import Link from 'next/link';

export default function Component() {
  return (
    <nav className="flex h-14 w-full items-center px-4 md:px-6 border-b border-gray-200 dark:border-gray-800">
      <Link className="font-semibold" href="#">
        Acme Inc
      </Link>
      <nav className="flex-1 mx-4">
        <Link className="mx-1" href="#">
          Page1
        </Link>
        <Link className="mx-1" href="#">
          Page2
        </Link>
        <Link className="mx-1" href="#">
          Page3
        </Link>
      </nav>
      <div className="space-x-2">
        <Link
          className="inline-flex h-8 items-center rounded-md border border-gray-200 border-gray-200 bg-white px-3 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-100/50"
          href="#"
        >
          buttonx
        </Link>
        <Link
          className="inline-flex h-8 items-center rounded-md bg-gray-200 px-3 text-sm font-medium transition-colors hover:bg-gray-300 hover:text-gray-900 focus:bg-gray-300 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-100/50"
          href="#"
        >
          buttony
        </Link>
      </div>
    </nav>
  );
}
