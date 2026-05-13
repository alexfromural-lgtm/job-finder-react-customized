import LandingHero from '../components/landing/LandingHero';
import LandingJobListings from '../components/landing/LandingJobListings';
import { useJobSearch } from '../hooks/useJobSearch';

export default function LandingPage() {
  const jobSearch = useJobSearch();

  return (
    <div className="hero-gradient" style={{ minHeight: '100vh' }}>
      <LandingHero totalJobs={jobSearch.meta.total} />
      <LandingJobListings hook={jobSearch} />
    </div>
  );
}
