import React from 'react';

const SplitLayout: React.FC = () => {
  return (
    <>
      <div className="mx-auto w-full px-5 h-[400px] max-w-[1165px] rounded-[16rem] glowsup slower-transition hover:slower-translate ">
        <div className="flex  gap-4  h-[400px] rounded-3xl slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] border border-white/10">
          <div className="flex flex-row flex-wrap items-center gap-2">
            <div className=" flex-auto max-w-[720px] h-72 p-2 m-6 space-y-3 sm:space-y-5 md:space-y-8 xl:space-y-7 ">
              <li className=" list-disc ml-5 no-wrap">Jan 2nd 2023</li>
              <div className="font-bold inline-block text-[2.8rem] sm:text-[4.5rem] md:text-[5.5rem]  ">
                Unclassified.
              </div>
              <span className=" font-bold block text-[2.8rem] sm:text-[4.5rem] md:text-[5.5rem]">
                Raw.
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
