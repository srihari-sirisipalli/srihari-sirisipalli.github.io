import { useEffect } from "react";
import Hero from "@/components/sections/Hero";
import WhatIDo from "@/components/sections/WhatIDo";
import FeaturedWork from "@/components/sections/FeaturedWork";
import TechMarquee from "@/components/sections/TechMarquee";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 300);
    }
  }, []);

  return (
    <>
      <Hero />
      <WhatIDo />
      <TechMarquee />
      <FeaturedWork />
      <About />
      <Contact />
    </>
  );
}
