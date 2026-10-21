import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4">
      <div className="glass-panel max-w-md w-full rounded-2xl border border-white/10 p-10 text-center">
        <p className="font-display text-7xl font-bold text-accent/40">404</p>
        <h1 className="font-display mt-4 text-2xl font-semibold text-white">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-accent/20 border border-accent/30 px-6 py-2.5 text-sm font-medium text-accent hover:bg-accent/30 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
