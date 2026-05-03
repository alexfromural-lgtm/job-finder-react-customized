type BadgeColor = 'blue' | 'teal' | 'purple' | 'green' | 'red' | 'yellow' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export default function Badge({ children, color = 'blue', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${color} ${className}`}>
      {children}
    </span>
  );
}

// Status-to-color map for ApplicationStatus
export const statusColor: Record<string, BadgeColor> = {
  submitted: 'blue',
  shortlisted: 'green',
  rejected: 'red',
  under_review: 'yellow',
};
