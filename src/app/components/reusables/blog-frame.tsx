import React, { ReactNode } from 'react';

const BlogFrameContainer: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
      {children}
    </div>
  );
};

export default BlogFrameContainer;
