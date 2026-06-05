import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  styles: any;
  globalStyles: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, styles, globalStyles }) => {
  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>
      <div style={styles.grid} />
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.card} className="card-enter">
        {children}
      </div>
    </div>
  );
};