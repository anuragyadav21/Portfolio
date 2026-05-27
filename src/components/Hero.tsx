import { profile } from "../data/profile";
import type { AudienceVariant } from "../types";

const heroStats = [
  { value: "8", label: "Years EPC delivery" },
  { value: "$23M+", label: "Programs delivered" },
  { value: "250 ac", label: "Largest program" },
  { value: "ASEP", label: "INCOSE certified" },
];

type HeroProps = {
  audience?: AudienceVariant;
};

export function Hero({ audience }: HeroProps) {
  const isTargeted = audience?.id && audience.id !== "default";

  return (
    <section id="hero">
      <div className="hero-l">
        <div className="hero-accent-line" aria-hidden="true" data-reveal="fade" />
        <div className="hero-identity" data-reveal="fade">
          <p className="hero-identity-line hero-identity-name">{profile.name}</p>
          <p className="hero-identity-line hero-identity-degree">{profile.degreeLine}</p>
          <p className="hero-identity-line hero-identity-contact">
            <a href={`mailto:${profile.email}`}>Email</a>
            <span className="hero-identity-sep" aria-hidden="true">
              ·
            </span>
            <a href={profile.linkedIn.href} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <span className="hero-identity-sep" aria-hidden="true">
              ·
            </span>
            <a href={profile.github.href} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span className="hero-identity-sep" aria-hidden="true">
              ·
            </span>
            <span>{profile.location}</span>
          </p>
        </div>
        <h1 className="hero-h1" data-reveal="up">Infrastructure Systems Engineer</h1>
        <p className="hero-discipline-layer" data-reveal="fade">
          Capital programs &middot; digital engineering &middot; operational modeling
        </p>
        <p className="hero-bio serif" data-reveal="up">
          Eight years delivering complex physical infrastructure across civil, structural, and MEP capital programs.
          $23M+ portfolio, 250-acre largest site, six concurrent projects at peak. On work like that, schedule slips
          and coordination errors had immediate physical consequences.
          <br />
          <br />
          At Cornell I picked up the formal toolkit for the same kinds of operational problems, applied
          computationally: MBSE and SysML for system architecture, digital twins for physical assets, stochastic
          optimization for schedules under uncertainty, and V&amp;V for deterministic and stochastic systems.
          <br />
          <br />
          Interested in infrastructure systems, digital engineering, and how operational modeling holds up when
          the physical work actually has to get built.
        </p>
        <div className="hero-cta-row" data-reveal="up">
          <a href="#epc" className="cta cta-primary">
            Start with field work
          </a>
          <a href="#projects" className="cta cta-ghost">
            See the work
          </a>
          <a
            href={profile.resume.href}
            className="cta cta-ghost"
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Resume
          </a>
        </div>
      </div>
      <div className="hero-r">
        {isTargeted && <div className="audience-note">Tailored view: {audience.id}</div>}
        <div className="hero-numbers" data-reveal-group>
          {heroStats.map((stat) => (
            <div className="hn hero-tile" key={stat.label} data-reveal="up">
              <span className="hn-val">{stat.value}</span>
              <span className="hn-lbl">{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="hero-tile hero-tile-prose" data-reveal="up">
          <span className="hero-tile-label">Focus</span>
          <p className="hero-note">
            Capital-program execution alongside digital engineering: MBSE, digital twins, stochastic optimization,
            and V&amp;V, applied to data-center, semiconductor, energy, and industrial-facility build-out.
          </p>
        </div>
        <div className="hero-tile hero-tile-prose hero-tile-accent" data-reveal="up">
          <span className="hero-tile-label">Thread</span>
          <p className="hero-tagline">
            Eight years getting complex physical systems built. Now applying computational tools to the same kinds
            of coordination and verification problems.
          </p>
        </div>
      </div>
    </section>
  );
}
