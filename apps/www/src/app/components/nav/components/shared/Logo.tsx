import Image from "next/image";

// this is not used btw, but can be, so change the `src`
export function Logo() {
  return (
    <Image
      width={25}
      height={25}
      src="https://avatars.githubusercontent.com/u/126174609?v=4"
      className="invisible h-8 w-auto rounded-full"
      alt="The logo"
    />
  );
}
