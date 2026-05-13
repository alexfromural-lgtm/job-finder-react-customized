import SkillTagInput from './SkillTagInput';

interface SkillsSectionProps {
  skills: string[];
  editing: boolean;
  onSkillsChange: (skills: string[]) => void;
}

export default function SkillsSection({ skills, editing, onSkillsChange }: SkillsSectionProps) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '1.25rem',
        animation: 'slideUp 0.4s ease',
      }}
    >
      <SkillTagInput skills={skills} editing={editing} onChange={onSkillsChange} />
    </div>
  );
}
