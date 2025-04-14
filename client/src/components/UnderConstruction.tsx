import { motion } from "framer-motion";
import { HardHat, Hammer, Construction } from "lucide-react";

export const UnderConstruction = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center"
    >
      <div className="flex gap-4 mb-6">
        <motion.div
          animate={{ rotate: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <HardHat className="w-12 h-12 text-yellow-500" />
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        >
          <Hammer className="w-12 h-12 text-blue-500" />
        </motion.div>
        <motion.div
          animate={{ rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
        >
          <Construction className="w-12 h-12 text-orange-500" />
        </motion.div>
      </div>
      
      <motion.h1
        className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        Under Construction
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-gray-600 max-w-md"
      >
        We're working hard to bring you an amazing NHL Playoff Sheets experience. Check back soon for exciting updates!
      </motion.p>
      
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { title: "Playoff Brackets", desc: "Create and share your playoff predictions" },
          { title: "Live Updates", desc: "Real-time scores and standings" },
          { title: "Community", desc: "Compete with friends and other fans" }
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}; 