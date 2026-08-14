import { SectionWipe } from "@/components/motion/section-wipe";
import type { LocaleContent } from "@/content/site-content";

type ContactProps = {
  content: LocaleContent;
};

export function Contact({ content }: ContactProps) {
  const { contact } = content;
  const email = contact.email.status === "ready" ? contact.email.value : contact.email.label;

  return (
    <SectionWipe>
      <section
        id="contact"
        className="content-section section-grid contact"
        aria-labelledby="contact-title"
        data-motion-accent="contact-finale"
      >
        <p className="section-index contact-index" aria-hidden="true">
          <span>06</span>
        </p>
        <p className="contact-label">{contact.label}</p>
        <h2 id="contact-title" className="contact-title">
          {contact.title}
        </h2>
        <p className="contact-body">{contact.body}</p>
        <p className="contact-email" data-content-status={contact.email.status}>
          {contact.email.status === "ready" ? (
            <a href={`mailto:${email}`} aria-label={`${contact.cta} ${email}`}>
              {contact.cta}
              <span>{email}</span>
            </a>
          ) : (
            email
          )}
        </p>
        <span className="contact-marker" aria-hidden="true" />
      </section>
    </SectionWipe>
  );
}
