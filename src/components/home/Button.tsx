import React from 'react';

interface ButtonPropType {
  content: string;
  icon?: boolean;
}

export const Button: React.FC<ButtonPropType> = ({ content, icon = true }) => {
  return (
    <div className="w-fit flex group">
      <button className="min-w-[100px] border border-white text-white px-5 py-4 font-medium">{content}</button>
      {icon && (
        <div className="border border-l-0 border-white w-14 group-hover:bg-gray-300 transition-all duration-300"></div>
      )}
    </div>
  );
};
