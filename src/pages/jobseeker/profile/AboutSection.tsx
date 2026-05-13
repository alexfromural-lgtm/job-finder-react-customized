import type { JobSeekerProfile } from '../../../types';
import FieldRow from './FieldRow';

interface AboutSectionProps {
  form: Partial<JobSeekerProfile>;
  editing: boolean;
  onChange: (name: string, value: string) => void;
}

export default function AboutSection({ form, editing, onChange }: AboutSectionProps) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginBottom: '1.25rem',
        animation: 'slideUp 0.35s ease',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>About</h2>

      <FieldRow
        label="Bio"
        name="bio"
        value={form.bio}
        editing={editing}
        placeholder="Write a short bio about yourself..."
        onChange={onChange}
        multiline
      />
      <FieldRow
        label="Location"
        name="location"
        value={form.location}
        editing={editing}
        placeholder="e.g. San Francisco, CA"
        onChange={onChange}
      />
      <FieldRow
        label="Resume URL"
        name="resumeUrl"
        value={form.resumeUrl}
        editing={editing}
        placeholder="https://yourresume.com/resume.pdf"
        onChange={onChange}
      />
    </div>
  );
}
