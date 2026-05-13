import type { JobSeekerProfile } from '../../../types';
import Button from '../../../components/ui/Button';
import FieldRow from './FieldRow';

interface BackgroundSectionProps {
  form: Partial<JobSeekerProfile>;
  editing: boolean;
  saving: boolean;
  onChange: (name: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function BackgroundSection({
  form,
  editing,
  saving,
  onChange,
  onSave,
  onCancel,
}: BackgroundSectionProps) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        animation: 'slideUp 0.45s ease',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Background</h2>

      <FieldRow
        label="Experience"
        name="experience"
        value={form.experience}
        editing={editing}
        placeholder="Describe your work experience..."
        onChange={onChange}
        multiline
      />
      <FieldRow
        label="Education"
        name="education"
        value={form.education}
        editing={editing}
        placeholder="Your educational background..."
        onChange={onChange}
        multiline
      />

      {editing && (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <Button id="profile-cancel-btn" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button id="profile-save-btn" variant="primary" loading={saving} onClick={onSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
