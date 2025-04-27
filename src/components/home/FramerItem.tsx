import React from 'react';
import { Link } from 'react-router-dom';

interface PropType {
  item: Record<'alt' | 'src' | 'label', string>;
  onClick?: () => void;
}

export const FramerItem: React.FC<PropType> = ({ item, onClick }) => {
  return (
    <div>
      <Link to='/shop' className="flex justify-center flex-col md:flex-row items-center gap-2" onClick={onClick}>
        <div className="h-28 w-44 rounded-lg overflow-hidden">
          <img
            src={item.src}
            alt={item.alt}
            className="w-full h-full object-cover"
          />
        </div>

        <p className="lg:text-7xl sm:text-4xl text-3xl font-clash">{item.label}</p>
      </Link>
    </div>
  );
};
