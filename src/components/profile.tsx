import { Reveal } from "@/components/motion/reveal";
import type { LocaleContent } from "@/content/site-content";

type ProfileProps = {
  content: LocaleContent;
};

export function Profile({ content }: ProfileProps) {
  const { profile } = content;

  return (
    <section
      id="profile"
      className="content-section brand-section profile"
      aria-labelledby="profile-title"
    >
      <div className="brand-section-grid">
        <p className="section-index profile-index" aria-hidden="true">
          <span>05</span>
        </p>
        <div className="profile-heading">
          <p className="section-kicker">{profile.label}</p>
          <h2 id="profile-title">{profile.title}</h2>
        </div>
        <Reveal className="profile-card">
          <p className="profile-role">{profile.role}</p>
          <h3>{profile.name}</h3>
          <ul className="profile-fields" aria-label="Profile fields">
            {profile.fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
          <div className="profile-bio">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
