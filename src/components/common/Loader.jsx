import { motion } from 'framer-motion';

export function MandalaSpinner({ size = 64 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        className="mandala-spinner"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="45" stroke="var(--color-primary)" strokeWidth="2" opacity="0.3" />
        <circle cx="50" cy="50" r="35" stroke="var(--color-secondary)" strokeWidth="2" opacity="0.3" />
        <circle cx="50" cy="50" r="25" stroke="var(--color-accent)" strokeWidth="2" opacity="0.3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="5"
            x2="50"
            y2="20"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
          <circle
            key={angle}
            cx="50"
            cy="10"
            r="3"
            fill="var(--color-accent)"
            opacity="0.7"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="8" fill="var(--color-primary)" opacity="0.8" />
        <circle cx="50" cy="50" r="4" fill="var(--color-accent)" />
      </svg>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-sm text-muted font-medium"
      >
        Loading...
      </motion.p>
    </div>
  );
}

export function ShimmerCard({ className = '' }) {
  return (
    <div className={`rounded-card overflow-hidden ${className}`}>
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3 bg-surface">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-chip" />
          <div className="skeleton h-6 w-16 rounded-chip" />
        </div>
        <div className="skeleton h-4 w-full rounded" />
      </div>
    </div>
  );
}

export function ShimmerGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
}

export default function Loader({ fullScreen = false, text = 'Loading...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
        <MandalaSpinner size={80} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <MandalaSpinner size={64} />
    </div>
  );
}
