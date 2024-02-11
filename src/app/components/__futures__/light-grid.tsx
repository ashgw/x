export default function LightGrid() {
  return (
    <>
      <div className=" flex justify-center items-center ">
        <div className="relative transition duration-1000 hover:skew-x-2 glowsup">
          <div className="grid grid-cols-10 gap-10 ">
            {Array.from({ length: 100 }, (_, index) => (
              <div
                key={index}
                className=" bg-blue-500 flex items-center justify-center rounded-full"
              >
                <span className="h-[0.12rem] w-[0.12rem] bg-blue-500 rounded-full animate-ping "></span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-24 w-full"></div>
    </>
  );
}
