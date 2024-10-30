// components/Button.tsx
import React from 'react';

interface ButtonProps {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text }) => {
  return (
    <button className="w-full p-2 bg-focus text-white rounded-md font-semibold">
      {text}
    </button>
  );
};

export default Button;
