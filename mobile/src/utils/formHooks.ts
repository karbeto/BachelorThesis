import { useEffect, useState } from 'react';

export function useFormField<T = string>(
  initialValue: T,
  validate?: (value: T) => string | undefined,
) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (!isTouched) return;

    const handler = setTimeout(() => {
      if (validate) {
        setError(validate(value));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [value, validate, isTouched]);

  const onChange = (val: T) => {
    setValue(val);
    if (!isTouched) setIsTouched(true);
  };

  const validateField = () => {
    if (!validate) return true;
    const err = validate(value);
    setError(err);
    return !err;
  };

  return { value, setValue, error, onChange, validateField, setError };
}

export const validateEmail = (value: string) => {
  if (!value) return 'Email is required';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? undefined : 'Invalid email format';
};

export const validatePassword = (value: string) => {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Min. 6 characters required';
  return undefined;
};

export const validateName = (value: string) =>
  value.trim() ? undefined : 'Name is required';

export function useModal(initial = false) {
  const [visible, setVisible] = useState(initial);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return { visible, setVisible, open, close };
}