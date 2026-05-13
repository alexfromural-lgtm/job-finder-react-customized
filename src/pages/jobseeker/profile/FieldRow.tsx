export interface FieldRowProps {
  label: string;
  value?: string;
  editing: boolean;
  placeholder?: string;
  name: string;
  onChange: (name: string, value: string) => void;
  multiline?: boolean;
}

export default function FieldRow({
  label,
  value,
  editing,
  placeholder,
  name,
  onChange,
  multiline,
}: FieldRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label className="input-label" htmlFor={`profile-field-${name}`}>
        {label}
      </label>
      {editing ? (
        multiline ? (
          <textarea
            id={`profile-field-${name}`}
            className="input textarea"
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange(name, e.target.value)}
          />
        ) : (
          <input
            id={`profile-field-${name}`}
            className="input"
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange(name, e.target.value)}
          />
        )
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: '0.95rem',
            color: value ? 'var(--color-text)' : 'var(--color-text-muted)',
            padding: '0.625rem 0',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {value || <em style={{ opacity: 0.5 }}>Not set</em>}
        </p>
      )}
    </div>
  );
}
