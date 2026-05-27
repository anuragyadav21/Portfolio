import { profile } from "../data/profile";

const footerLinks = [
  {
    key: "email",
    icon: "/assets/icons/nav-email.svg",
    label: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    key: "phone",
    icon: "/assets/icons/nav-phone.svg",
    label: profile.phone,
    href: profile.phoneHref,
  },
  {
    key: "linkedin",
    icon: "/assets/icons/nav-linkedin.svg",
    label: "LinkedIn",
    href: profile.linkedIn.href,
    external: true,
  },
  {
    key: "github",
    icon: "/assets/icons/nav-github.svg",
    label: "GitHub",
    href: profile.github.href,
    external: true,
  },
  {
    key: "resume",
    icon: "/assets/icons/ft-resume.svg",
    label: "Resume",
    href: profile.resume.href,
    external: true,
    download: true,
  },
];

export function Footer() {
  return (
    <footer data-reveal="up" data-delay="1">
      <div className="ft-main">
        <span className="ft-name">{profile.name}</span>
        <span className="ft-note">
          {profile.degreeLine} · {profile.location}
        </span>
      </div>
      <ul className="ft-links">
        {footerLinks.map((item) => (
          <li key={item.key}>
            <a
              className="ft-link-item"
              href={item.href}
              aria-label={item.label}
              title={item.label}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(item.download ? { download: true } : {})}
            >
              <img className="ft-link-icon" src={item.icon} alt="" width={16} height={16} />
              <span className="ft-link-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
