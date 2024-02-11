'use client';
export default function Com() {
  return (
    <>
      {' '}
      <div className=" flex justify-center items-center ">
        <div className="relative average-transition hover:scale-80">
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 144 }, (_, index) => (
              <div
                key={index}
                className=" bg-pink-500 flex items-center justify-center rounded-full"
              >
                <span className="h-1 w-1 bg-red-200 rounded-full animate-ping "></span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-24 w-full"></div>
    </>
  );
}
