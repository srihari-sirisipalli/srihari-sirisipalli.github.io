import { personal } from "@/data/personal";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-surface-border" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p>
          &copy; {new Date().getFullYear()} {personal.name}. Built with React &
          Framer Motion.
        </p>
        <div className="flex items-center gap-4">
          {personal.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary active:text-primary transition-colors py-2 px-1"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
