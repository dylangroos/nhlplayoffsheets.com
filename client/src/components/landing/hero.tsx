import { motion } from 'framer-motion';

export function Hero() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h1 className="text-5xl md:text-7xl font-bold text-[#2C3E50]">
        NHL Playoff Sheets
      </h1>
      <p className="text-xl md:text-2xl text-[#34495E]/80">
        Your Ultimate Playoff Pool Experience
      </p>
    </motion.div>
  );
} 