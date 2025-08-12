"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ScrollTiltCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const ScrollTiltCard: React.FC<ScrollTiltCardProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.03, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          rotateX: rotate,
          scale,
          boxShadow:
            "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollTiltCard;


