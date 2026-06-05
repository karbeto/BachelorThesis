import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  styles: any;
}

export const Input: React.FC<InputProps> = ({ label, styles, onFocus, onBlur, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        style={{
          ...styles.input,
          ...(isFocused ? styles.inputFocused : {}),
        }}
      />
    </div>
  );
};