import { motion, type Variants } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  maxWidth?: "prose" | "default" | "wide";
}

const widthMap = {
  prose: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
};

export default function SectionWrapper({
  id,
  children,
  className,
  variants = fadeUp,
  maxWidth = "default",
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      className={cn("relative py-20 sm:py-28 md:py-32 px-5 sm:px-8", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      <div className={cn(widthMap[maxWidth], "mx-auto")}>{children}</div>
    </motion.section>
  );
}
