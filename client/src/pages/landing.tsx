import { motion } from 'framer-motion';
import { Hero } from '@/components/landing/hero';
import { SignInCard } from '@/components/auth/sign-in-card';
import { ComingSoon } from '@/components/landing/coming-soon';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center space-y-8"
      >
        <Hero />
        <SignInCard />
        <ComingSoon />
      </motion.div>
    </div>
  );
} 