interface JobDetailSectionProps {
  title: string;
  content: string;
}

export default function JobDetailSection({ title, content }: JobDetailSectionProps) {
  return (
    <div>
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
        {title}
      </h3>
      <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--color-text)' }}>
        {content}
      </p>
    </div>
  );
}
