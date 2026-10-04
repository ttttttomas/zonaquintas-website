"use client";

// Original: https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/cards/CardArc5.tsx
// License: ./amicro-LICENSE
import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CardArc5Props {
  angle?: number;
  gap?: number;
  yOffset?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
  hovered?: boolean;
  images?: string[];
  children?: React.ReactNode;
}

export const CardArc5 = React.memo(function CardArc5({
  angle = 30,
  gap = 70,
  yOffset = 10,
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-400 dark:bg-neutral-800',
  className = '',
  hovered,
  images,
  children
}: CardArc5Props) {
  const [isHovered, setIsHovered] = useState(false);
  const active = hovered !== undefined ? hovered : isHovered;
  const cards = [0, 1, 2, 3, 4];
  const center = 2;

  const springConfig = {
    type: "spring" as const,
    stiffness: 180,
    damping: 20,
    mass: 0.8
  };

  // Center card transforms (dist === 0)
  const centerY = active ? -yOffset * hoverIntensity : 0;
  const centerScale = active ? 1.05 : 1;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[15rem] h-[15rem] cursor-pointer flex items-center justify-center ${className}`}
    >
      {cards.map((i) => {
        const dist = i - center;
        const targetRotate = active ? dist * (angle / center) * hoverIntensity : 0;
        const targetX = active ? dist * (gap / center) * hoverIntensity : 0;

        // Match the parabola translateY: card0/4 = 10px, card1/3 = -2px, card2 = -10px
        let targetY = 0;
        if (active) {
          if (Math.abs(dist) === 2) targetY = yOffset;
          else if (Math.abs(dist) === 1) targetY = -0.2 * yOffset;
          else targetY = -yOffset;
          targetY = targetY * hoverIntensity;
        }

        return (
          <motion.div
            key={i}
            animate={{
              rotate: targetRotate,
              x: targetX,
              y: targetY,
              scale: active ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              ...springConfig,
              duration
            }}
            style={{
              zIndex: 3 - Math.abs(dist),
              originX: 0.5,
              originY: 1,
              backgroundImage: images ? `url(${images[i % images.length]})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15),0_2px_6px_-2px_rgba(0,0,0,0.1)] border border-neutral-200/20 ${cardClassName}`}
          />
        );
      })}
      {children && (
        <motion.div
          animate={{
            y: centerY,
            scale: centerScale,
          }}
          transition={{
            ...springConfig,
            duration
          }}
          style={{
            zIndex: 10,
            originX: 0.5,
            originY: 1,
          }}
          className="absolute inset-0 rounded-2xl overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
});
