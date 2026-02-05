import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ className = '', label, error, ...props }) => {
  return (
    <div className="relative group">
      <input 
        className={`peer w-full px-4 py-3 rounded-xl border-2 bg-stone-50 text-slate-900 placeholder-transparent focus:outline-none focus:ring-0 transition-all duration-300 ${
          error 
            ? 'border-red-300 focus:border-red-500' 
            : 'border-stone-200 focus:border-orange-500 hover:border-orange-200'
        } ${className}`}
        placeholder={label || 'Input'}
        {...props}
      />
      {label && (
        <label className={`absolute left-4 -top-2.5 bg-white px-2 text-xs font-bold text-stone-400 transition-all duration-300 
          peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-3.5 
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-600 pointer-events-none`}>
          {label}
        </label>
      )}
      {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
  );
};

export default Input;
