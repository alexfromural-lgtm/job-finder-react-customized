import { useState, useEffect } from 'react';
import { getJobSeekerProfile, updateJobSeekerProfile } from '../../api/profile.api';
import type { JobSeekerProfile } from '../../types';
import ProfileHeader from './profile/ProfileHeader';
import ProfileAlerts from './profile/ProfileAlerts';
import AboutSection from './profile/AboutSection';
import SkillsSection from './profile/SkillsSection';
import BackgroundSection from './profile/BackgroundSection';

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
        <ProfileHeader
          profile={profile}
          location={form.location}
          editing={editing}
          onEdit={() => setEditing(true)}
        />

        <ProfileAlerts success={success} error={error} />

        <AboutSection form={form} editing={editing} onChange={handleChange} />

        <SkillsSection skills={skills} editing={editing} onSkillsChange={setSkills} />

        <BackgroundSection
          form={form}
          editing={editing}
          saving={saving}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
