import { personal } from "@/data/personal";

export default function Footer() {
  return (
    <footer
      className="border-t border-rule mt-24"
      style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-ink-faint">
          &copy; {new Date().getFullYear()} {personal.name}
        </p>
        <div className="flex items-center gap-6 text-sm">
          {personal.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft hover:text-accent transition-colors link-underline"
            >
              {link.platform}
            </a>
          ))}
          <a
            href={`mailto:${personal.email}`}
            className="text-ink-soft hover:text-accent transition-colors link-underline"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
