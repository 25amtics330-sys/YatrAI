import DestinationCard from './DestinationCard';
import { motion } from 'framer-motion';

export default function DestinationGrid({ destinations }) {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl font-heading text-text mb-2">No destinations found 🐪</p>
        <p className="text-muted">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {destinations.map((dest, index) => (
        <motion.div
          key={dest.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <DestinationCard destination={dest} />
        </motion.div>
      ))}
    </div>
  );
}
