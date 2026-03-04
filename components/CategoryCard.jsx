import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryCard = ({ title, icon, path }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div
        onClick={() => navigate(path)}
        className="relative h-40 rounded-[22px] bg-gradient-to-br from-[#0b1020] to-[#0f172a] text-white overflow-hidden cursor-pointer flex items-center justify-center transition-all duration-400 hover:-translate-y-2 hover:scale-[1.03] group
                   border border-transparent before:absolute before:inset-0 before:p-[2px] before:rounded-[22px] before:bg-gradient-to-r before:from-[#8b5cf6] before:via-[#ec4899] before:to-[#22d3ee] before:animate-border-glow before:[mask-composite:exclude] before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]"
        style={{
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.25)'
        }}
      >
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <div className="text-4xl text-violet-400">{icon}</div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
