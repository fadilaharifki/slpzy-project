"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Free shipping for orders above IDR 1mil",
  "Special offer 15% for first order",
  "100% Certified Lenzing TENCEL™ Lyocell · Feels so right",
];

/**
 * Parachute-style promo strip — thin, full-width, centered, gently rotating.
 * Sits above the navbar in normal flow (scrolls away on scroll).
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 380);
    }, 4600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-sage-deep text-paper">
      <div className="mx-auto flex h-9 max-w-[1500px] items-center justify-center px-6">
        <p
          className={`text-[11px] font-medium tracking-wide transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {MESSAGES[index]}
        </p>
      </div>
    </div>
  );
}
