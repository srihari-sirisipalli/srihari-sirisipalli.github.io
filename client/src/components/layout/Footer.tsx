import { Link } from "wouter";
import { personal } from "@/data/personal";

const footerRoutes = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/experience", label: "Experience" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer
      className="py-10 px-4 border-t border-surface-border"
      style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          {footerRoutes.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="text-text-muted hover:text-primary transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
            >
              {r.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p>
            &copy; {new Date().getFullYear()} {personal.name}. Built with React
            &amp; Framer Motion.
          </p>
          <div className="flex items-center gap-4">
            {personal.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary active:text-primary transition-colors py-2 px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
