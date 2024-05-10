import { PUBLIC_BLOG_IMAGES_SOURCE } from '@/lib/constants';

export default function Z() {
  return (
    <>
      <div className="mx-auto w-full px-5 h-[400px] max-w-[1165px] rounded-[16rem] ">
        <img
          alt="niko"
          src={PUBLIC_BLOG_IMAGES_SOURCE + 'winston-wolfe.png'}
          sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 90vw"
        ></img>
      </div>
    </>
  );
}
