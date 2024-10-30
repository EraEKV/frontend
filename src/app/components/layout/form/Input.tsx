import React from 'react';

interface InputProps {
  type: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input: React.FC<InputProps> = ({ type, label, value, placeholder, onChange, onBlur, error }) => {
  return (
    <div className='space-y-1'>
      <label className='text-md font-semibold text-gray-500'>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full font-semibold py-2 px-3 border-2 ${error ? 'border-red-500' : 'border-primary'} focus:outline-none ${error ? 'focus:border-red-500' : 'focus:border-focus'} rounded-md`}
      />
      {error && <div className='text-red-500'>{error}</div>}
    </div>
  );
};

export default Input;
