import { useState } from 'react';
import Button from '../../../components/ui/Button';

export interface SkillTagInputProps {
  skills: string[];
  editing: boolean;
  onChange: (skills: string[]) => void;
}

export default function SkillTagInput({ skills, editing, onChange }: SkillTagInputProps) {
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
