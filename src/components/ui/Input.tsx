import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`input textarea ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  )
);
Textarea.displayName = 'Textarea';
