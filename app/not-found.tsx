import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-silk px-16">
      <div className="text-center">
        <h1 className="text-6xl font-light text-ink mb-6">404</h1>
        <h2 className="text-2xl font-light text-smoke mb-8">Page Not Found</h2>
        <p className="text-lg text-smoke mb-12 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-flame text-white font-medium text-sm uppercase tracking-wider transition-all duration-300 hover:bg-ember"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}