import { motion, type Variants } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}

export default function SectionWrapper({
  id,
  children,
  className,
  variants = fadeUp,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      className={cn("relative py-20 md:py-28 px-4 md:px-8", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}
