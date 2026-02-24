import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-4xl font-semibold text-slate-900">404</p>
      <p className="text-sm text-slate-500">The page you are looking for does not exist.</p>
      <Button asChild>
        <Link to="/leads">Back to Leads</Link>
      </Button>
    </div>
  );
};
