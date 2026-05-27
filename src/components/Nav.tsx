import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";

const links = [
  { href: "#epc", label: "Field Work" },
  { href: "#working", label: "Fit" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "V-Model" },
  { href: "#lessons", label: "Cornell" },
  { href: "#life", label: "Life" },
  { href: "#contact", label: "Contact" },
];

const contactIcons = [
  {
    key: "email",
    src: "/assets/icons/nav-email.svg",
    href: `mailto:${profile.email}`,
    label: `Email ${profile.email}`,
  },
  {
    key: "linkedin",
    src: "/assets/icons/nav-linkedin.svg",
    href: profile.linkedIn.href,
    label: "LinkedIn",
    external: true,
  },
  {
    key: "phone",
    src: "/assets/icons/nav-phone.svg",
    href: profile.phoneHref,
    label: `Phone ${profile.phone}`,
  },
  {
    key: "location",
    src: "/assets/icons/nav-location.svg",
    href: "#contact",
    label: `Location — ${profile.location}`,
  },
  {
    key: "github",
    src: "/assets/icons/nav-github.svg",
    href: profile.github.href,
    label: "GitHub",
    external: true,
  },
] as const;

export function Nav() {
  const [activeHref, setActiveHref] = useState("#hero");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const sections = ["hero", ...links.map((link) => link.href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? window.scrollY / total : 0);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <nav>
      <div className="nav-brand">
        <a href="#hero" className={activeHref === "#hero" ? "nav-logo active" : "nav-logo"}>
          <span className="nav-logo-mark" aria-hidden="true" />
          <span className="nav-logo-name">{profile.name}</span>
        </a>
      </div>

      <div className="nav-links">
        {links.map((link) => (
          <a href={link.href} className={activeHref === link.href ? "active" : ""} key={link.href}>
            {link.label}
          </a>
        ))}
      </div>

      <div className="nav-utils">
        <ul className="nav-contact" aria-label="Quick contact">
          {contactIcons.map((item) => (
            <li key={item.key}>
              <a
                className="nav-icon-btn"
                href={item.href}
                aria-label={item.label}
                title={item.label}
                {...("external" in item && item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <img className="nav-icon-img" src={item.src} alt="" width={18} height={18} />
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.resume.href}
          className="nav-resume"
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          Resume
        </a>
      </div>

      <div
        className="nav-progress"
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />
    </nav>
  );
}
