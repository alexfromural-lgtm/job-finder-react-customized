import type { JobSeekerProfile } from '../../../types';
import Button from '../../../components/ui/Button';

interface ProfileHeaderProps {
  profile: JobSeekerProfile | null;
  location?: string;
  editing: boolean;
  onEdit: () => void;
}

export default function ProfileHeader({ profile, location, editing, onEdit }: ProfileHeaderProps) {
  return (
    <div
      className="glass-strong"
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap',
        animation: 'slideUp 0.3s ease',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          flexShrink: 0,
        }}
      >
        👤
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800, wordBreak: 'break-word' }}>
          {profile?.user?.name ?? 'Job Seeker'}
        </h1>
        <p style={{ margin: '0 0 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          {profile?.user?.email}
        </p>
        {location && (
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            📍 {location}
          </p>
        )}
        <div style={{ marginTop: '0.5rem' }}>
          <span className="badge badge-purple">JOB SEEKER</span>
        </div>
      </div>

      {!editing && (
        <Button id="profile-edit-btn" variant="secondary" onClick={onEdit}>
          ✏️ Edit Profile
        </Button>
      )}
    </div>
  );
}
