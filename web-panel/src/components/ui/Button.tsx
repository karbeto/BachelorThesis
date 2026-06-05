import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  styles: any;
}

export const Button: React.FC<ButtonProps> = ({ children, loading, styles, ...props }) => {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      style={{
        ...styles.button,
        ...(loading ? styles.buttonLoading : {}),
      }}
    >
      {loading ? <span style={styles.spinner} /> : children}
    </button>
  );
};