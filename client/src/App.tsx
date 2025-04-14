import { motion } from 'framer-motion';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          NHL Playoff Sheets
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/10 blur-xl rounded-full transform -translate-y-1/2"></div>
          <p className="text-xl md:text-2xl font-semibold mb-8 relative">
            Your Ultimate Playoff Pool Experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mt-8"
        >
          <p className="text-lg">
            🏗️ Under Construction 🏗️
          </p>
          <p className="text-sm mt-2 text-blue-200">
            We're working hard to bring you something amazing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <div className="flex gap-4 justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-400 rounded-full"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
