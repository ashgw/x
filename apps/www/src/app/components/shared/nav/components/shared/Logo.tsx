import Image from 'next/image';

export function Logo() {
  return (
    <Image
      width={25}
      height={25}
      src="https://avatars.githubusercontent.com/u/126174609?v=4"
      className="h-8 w-auto rounded-full invisible"
      alt="The logo"
    />
  );
}
