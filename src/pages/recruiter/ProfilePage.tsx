import { useState, useEffect } from 'react';
import { getRecruiterProfile, updateRecruiterProfile } from '../../api/profile.api';
import type { RecruiterProfile } from '../../types';
import Button from '../../components/ui/Button';

// ─── Field rows ──────────────────────────────────────────────────────────────
interface FieldRowProps {
  label: string;
  value?: string;
  editing: boolean;
  required?: boolean;
  placeholder?: string;
  name: string;
  onChange: (name: string, value: string) => void;
  multiline?: boolean;
}

function FieldRow({ label, value, editing, required, placeholder, name, onChange, multiline }: FieldRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label className="input-label" htmlFor={`profile-field-${name}`}>
        {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
      {editing ? (
        multiline ? (
          <textarea
            id={`profile-field-${name}`}
            className="input textarea"
            value={value ?? ''}
            placeholder={placeholder}
            required={required}
            onChange={(e) => onChange(name, e.target.value)}
          />
        ) : (
          <input
            id={`profile-field-${name}`}
            className="input"
            value={value ?? ''}
            placeholder={placeholder}
            required={required}
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
export default function RecruiterProfilePage() {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [form, setForm] = useState<Partial<RecruiterProfile>>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getRecruiterProfile(controller.signal)
      .then((p) => {
        setProfile(p);
        setForm(p);
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
    if (!form.companyName?.trim()) {
      setError('Company name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const updated = await updateRecruiterProfile({
        companyName: form.companyName,
        companyWebsite: form.companyWebsite,
        description: form.description,
        industry: form.industry,
      });
      setProfile(updated);
      setForm(updated);
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
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              flexShrink: 0,
            }}
          >
            🏢
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800, wordBreak: 'break-word' }}
            >
              {profile?.user?.name ?? 'Recruiter'}
            </h1>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {profile?.user?.email}
            </p>
            <div style={{ marginTop: '0.5rem' }}>
              <span className="badge badge-blue">RECRUITER</span>
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

        {/* Profile card */}
        <div
          className="glass"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animation: 'slideUp 0.35s ease',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Company Information</h2>

          <FieldRow
            label="Company Name"
            name="companyName"
            value={form.companyName}
            editing={editing}
            required
            placeholder="Your company name"
            onChange={handleChange}
          />
          <FieldRow
            label="Industry"
            name="industry"
            value={form.industry}
            editing={editing}
            placeholder="e.g. Technology, Finance, Healthcare"
            onChange={handleChange}
          />
          <FieldRow
            label="Company Website"
            name="companyWebsite"
            value={form.companyWebsite}
            editing={editing}
            placeholder="https://yourcompany.com"
            onChange={handleChange}
          />
          <FieldRow
            label="Company Description"
            name="description"
            value={form.description}
            editing={editing}
            placeholder="Tell candidates about your company..."
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
