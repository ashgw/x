"use client";

import BaseHeading from "./BaseHeading";

interface HeadingProps {
  title: string;
  id?: string;
}

const MajorHeading = ({ title, id }: HeadingProps) => {
  return (
    <BaseHeading id={id} className="glows-dimmed dimmed-4 text-2xl font-bold">
      {title}
    </BaseHeading>
  );
};

export default MajorHeading;
