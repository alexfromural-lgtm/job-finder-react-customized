import { useState, useEffect } from 'react';
import { getJobSeekerProfile, updateJobSeekerProfile } from '../../api/profile.api';
import type { JobSeekerProfile } from '../../types';
import Button from '../../components/ui/Button';

// ─── Skill tag input ─────────────────────────────────────────────────────────
interface SkillTagInputProps {
  skills: string[];
  editing: boolean;
  onChange: (skills: string[]) => void;
}

function SkillTagInput({ skills, editing, onChange }: SkillTagInputProps) {
  const [input, setInput] = useState('');

  const addSkill = (raw: string) => {
    const trimmed = raw.trim().replace(/,$/, '');
    if (!trimmed) return;
    const newSkills = trimmed
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !skills.includes(s));
    if (newSkills.length) onChange([...skills, ...newSkills]);
    setInput('');
  };

  const removeSkill = (skill: string) => onChange(skills.filter((s) => s !== skill));

  return (
    <div>
      <p className="input-label" style={{ marginBottom: '0.5rem' }}>
        Skills
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: editing ? '0.75rem' : 0,
          minHeight: '2rem',
        }}
      >
        {skills.length === 0 && !editing && (
          <em style={{ color: 'var(--color-text-muted)', opacity: 0.5, fontSize: '0.9rem' }}>
            No skills added yet
          </em>
        )}
        {skills.map((skill) => (
          <span
            key={skill}
            className="badge badge-teal"
            style={{ gap: '0.4rem', fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
          >
            {skill}
            {editing && (
              <button
                type="button"
                aria-label={`Remove ${skill}`}
                onClick={() => removeSkill(skill)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  padding: 0,
                  lineHeight: 1,
                  fontSize: '0.85rem',
                  opacity: 0.7,
                }}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      {editing && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            id="skill-tag-input"
            className="input"
            placeholder="Add skill and press Enter (or separate by comma)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addSkill(input);
              }
            }}
            onBlur={() => addSkill(input)}
          />
          <Button id="skill-add-btn" variant="secondary" size="sm" onClick={() => addSkill(input)}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Field row ───────────────────────────────────────────────────────────────
interface FieldRowProps {
  label: string;
  value?: string;
  editing: boolean;
  placeholder?: string;
  name: string;
  onChange: (name: string, value: string) => void;
  multiline?: boolean;
}

function FieldRow({ label, value, editing, placeholder, name, onChange, multiline }: FieldRowProps) {
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

// ─── Main page ───────────────────────────────────────────────────────────────
export default function JobSeekerProfilePage() {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [form, setForm] = useState<Partial<JobSeekerProfile>>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getJobSeekerProfile(controller.signal)
      .then((p) => {
        setProfile(p);
        setForm(p);
        setSkills(p.skills ?? []);
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return;
        setError('Failed to load profile. Please try again.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await updateJobSeekerProfile({
        bio: form.bio,
        location: form.location,
        skills,
        education: form.education,
        experience: form.experience,
        resumeUrl: form.resumeUrl,
      });
      setProfile(updated);
      setForm(updated);
      setSkills(updated.skills ?? []);
      setEditing(false);
      setSuccess('Profile updated successfully! ✅');
      setTimeout(() => setSuccess(''), 3500);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile ?? {});
    setSkills(profile?.skills ?? []);
    setEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="page hero-gradient">
        <div className="spinner-page">
          <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page hero-gradient">
      <div className="container" style={{ maxWidth: 720 }}>
        {/* Header card */}
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
            <h1
              style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800, wordBreak: 'break-word' }}
            >
              {profile?.user?.name ?? 'Job Seeker'}
            </h1>
            <p style={{ margin: '0 0 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {profile?.user?.email}
            </p>
            {form.location && (
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                📍 {form.location}
              </p>
            )}
            <div style={{ marginTop: '0.5rem' }}>
              <span className="badge badge-purple">JOB SEEKER</span>
            </div>
          </div>
          {!editing && (
            <Button id="profile-edit-btn" variant="secondary" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </Button>
          )}
        </div>

        {/* Alerts */}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
            {success}
          </div>
        )}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        {/* About section */}
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
            onChange={handleChange}
            multiline
          />
          <FieldRow
            label="Location"
            name="location"
            value={form.location}
            editing={editing}
            placeholder="e.g. San Francisco, CA"
            onChange={handleChange}
          />
          <FieldRow
            label="Resume URL"
            name="resumeUrl"
            value={form.resumeUrl}
            editing={editing}
            placeholder="https://yourresume.com/resume.pdf"
            onChange={handleChange}
          />
        </div>

        {/* Skills section */}
        <div
          className="glass"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '1.25rem',
            animation: 'slideUp 0.4s ease',
          }}
        >
          <SkillTagInput skills={skills} editing={editing} onChange={setSkills} />
        </div>

        {/* Experience & Education section */}
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
            onChange={handleChange}
            multiline
          />
          <FieldRow
            label="Education"
            name="education"
            value={form.education}
            editing={editing}
            placeholder="Your educational background..."
            onChange={handleChange}
            multiline
          />

          {editing && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <Button id="profile-cancel-btn" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button id="profile-save-btn" variant="primary" loading={saving} onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
