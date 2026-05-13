import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

interface JobDetailCTAProps {
  isAuthenticated: boolean;
  isJobSeeker: boolean;
  checkingApplication: boolean;
  applicationId: string | null;
  onApplyClick: () => void;
}

export default function JobDetailCTA({
  isAuthenticated,
  isJobSeeker,
  checkingApplication,
  applicationId,
  onApplyClick,
}: JobDetailCTAProps) {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Button id="apply-login-prompt" variant="primary" size="lg" onClick={() => navigate('/login')}>
        Login to Apply
      </Button>
    );
  }

  if (!isJobSeeker) return null;

  if (checkingApplication) {
    return (
      <Button id="apply-btn" variant="primary" size="lg" disabled>
        <span className="spinner" style={{ width: 16, height: 16, display: 'inline-block', marginRight: '0.5rem' }} />
        Checking…
      </Button>
    );
  }

  if (applicationId) {
    return (
      <Button
        id="applied-badge"
        variant="primary"
        size="lg"
        disabled
        style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', cursor: 'default', opacity: 1 }}
      >
        ✓ Applied
      </Button>
    );
  }

  return (
    <Button id="apply-btn" variant="primary" size="lg" onClick={onApplyClick}>
      Apply Now →
    </Button>
  );
}
