import React from 'react';

const NewNav: React.FC = () => {
  return (
    <div className="flex mx-auto  px-5">
      <div id="id1" className="w-1/4 p-4 bg-red-800">
        {/* Content for id1 */}
      </div>
      <div id="id1-s" className=" p-4  bg-red-300">
        {/* Content for id1 */}
      </div>
      <div
        id="id2"
        className="average-transition basis-1/3 hover:basis-1/2  bg-pink-800"
      >
        {/* Content for id2 */}
      </div>
      <div id="id3" className="w-1/4 p-4 bg-blue-800">
        {/* Content for id3 */}
      </div>
    </div>
  );
};

export default NewNav;
