interface ProfileAlertsProps {
  success: string;
  error: string;
}

export default function ProfileAlerts({ success, error }: ProfileAlertsProps) {
  return (
    <>
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
    </>
  );
}
