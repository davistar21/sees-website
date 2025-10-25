import React from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Swamp404: React.FC = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-white text-swamp px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <img
        src="/404-error-animate.svg"
        alt="404 Page Not Found"
        className="w-full max-w-md mb-8"
      />
      <motion.p
        className="text-xl mb-6 text-gray-700 font-medium"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ease: "easeInOut" }}
      >
        Oops! Looks like you&apos;re a bit off the map.
      </motion.p>
      <motion.p
        className="text-lg mb-8 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, ease: "easeInOut" }}
      >
        Let&apos;s guide you back home.
      </motion.p>
      <motion.button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-swamp text-white px-6 py-3 rounded-2xl hover:bg-[#02543d] transition-colors animate-pulse"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", delay: 0.8 }}
      >
        <Home size={20} />
        Go to Homepage
      </motion.button>
    </motion.div>
  );
};

export default Swamp404;
