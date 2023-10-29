import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(false);
  const { label, errorMessage, onChange, id, className, ...inputProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div>
      <label htmlFor={id} className={className}>
        {label && <p className="pb-2 font-semibold">{label}</p>}
        <Input
          {...inputProps}
          onChange={onChange}
          onBlur={handleFocus}
          onFocus={() =>
            inputProps.name === 'confirmPassword' && setFocused(true)
          }
          className={errorMessage ? 'border border-red-500' : ''}
          focused={focused.toString()}
        />
      </label>
      <p
        className={
          errorMessage ? 'capitalize italic text-red-500' : 'h-0 opacity-0'
        }
      >
        {errorMessage}
      </p>
    </div>
  );
};

export default FormInput;
