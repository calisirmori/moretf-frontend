import React from "react";

interface NewTagProps {
  className?: string;
}

const NewTag: React.FC<NewTagProps> = ({ className = "" }) => {
  return (
    <div
      className={`absolute text-[6px] -top-1 right-1 rotate-45 text-brand-orange font-bold uppercase ${className}`}
    >
      NEW
    </div>
  );
};

export default NewTag;
