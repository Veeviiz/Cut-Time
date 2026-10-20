// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export default function NumberAnimate({ value = 0, type = "number" }) {
  const count = useMotionValue(0);

  // ปัดเป็นจำนวนเต็มก่อน
  const rounded = useTransform(count, (v) => Math.floor(v));

  // แล้วค่อย format เป็นเงิน (ไม่มีทศนิยม)
  const formatted = useTransform(rounded, (v) => {
    switch (type) {
      case "currency":
        return `฿${v.toLocaleString("th-TH")}`;

      case "time": {
        const hours = Math.floor(v / 3600);
        const minutes = Math.floor((v % 3600) / 60);
        return `${hours}h ${minutes}m`;
      }
      case "duration":
        return `${v} mins`;

      default:
        return v.toLocaleString();
    }
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [value]);

  return <motion.span>{formatted}</motion.span>;
}
