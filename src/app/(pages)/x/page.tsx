import React from 'react';

const SplitLayout: React.FC = () => {
  return (
    <>
      <div className="mx-auto w-full h-[400px] max-w-[1165px] rounded-5xl glowsup slower-transition hover:slower-translate ">
        <div className="flex flex-col gap-4  h-[420px] rounded-3xl border border-white/20 m-5">
          <div className="flex flex-row flex-wrap items-center gap-2">
            <div className=" flex-auto max-w-[720px] h-72 p-6 m-6 space-y-7 ">
              <li className=" list-disc ml-5 no-wrap">Jan 2nd 2023</li>
              <div className=" font-bold inline-block text-[3.0rem] sm:text-[4.5rem] md:text-[5.5rem]  ">
                Build backends.
              </div>
              <span className=" font-bold block text-[3.0rem] sm:text-[4.5rem] md:text-[5.5rem]">
                Fast.
              </span>
              <p className="mt-3 lg:text-xl">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet
                hic voluptatum hic omnis laudantium accusamus.
              </p>
            </div>
            <div className="  flex-auto max-w-[720px] h-72 p-6 m-6 gap-11 "></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplitLayout;
