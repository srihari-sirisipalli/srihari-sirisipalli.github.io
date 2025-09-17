import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Research from "@/components/Research";
import Education from "@/components/Education";
import Leadership from "@/components/Leadership";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Research />
      <Education />
      <Leadership />
      <Contact />
      <Footer />
    </div>
  );
}
