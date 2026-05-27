import { profile, profileContactLinks } from "../data/profile";

export function ContactSection() {
  return (
    <section id="contact">
      <div data-reveal="up">
        <h2 className="ct-title">
          Reach
          <br />
          <span>out</span>
        </h2>
        <p className="ct-body">
          Most of the problems I keep coming back to are about how complex systems behave once field conditions,
          uncertainty, and coordination start interacting at once.
          <br />
          <br />
          If you&rsquo;re working on something in that space, I&rsquo;d be glad to talk.
        </p>
        <p className="ct-body ct-body-availability">{profile.locationNote}</p>
        <p className="ct-meta">
          {profile.name} · {profile.location} · {profile.phone}
        </p>
      </div>
      <div className="ct-links" data-reveal-group>
        {profileContactLinks.map((link) =>
          link.href ? (
            <a
              className="ctl"
              href={link.href}
              key={link.type}
              data-reveal="up"
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              {...(link.type === "Resume" ? { download: true } : {})}
            >
              <span className="ctl-type">{link.type}</span>
              <span className="ctl-val">{link.label}</span>
              <span className="ctl-arr">→</span>
            </a>
          ) : (
            <div className="ctl ctl-static" key={link.type} data-reveal="up">
              <span className="ctl-type">{link.type}</span>
              <span className="ctl-val">{link.label}</span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
