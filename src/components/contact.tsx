import type { LocaleContent } from "@/content/site-content";

type ContactProps = {
  content: LocaleContent;
};

export function Contact({ content }: ContactProps) {
  const { contact } = content;
  const email = contact.email.status === "ready" ? contact.email.value : contact.email.label;

  return (
    <section
      id="contact"
      className="content-section section-grid contact"
      aria-labelledby="contact-title"
    >
      <p className="section-index contact-index" aria-hidden="true">
        <span>04</span>
      </p>
      <h2 id="contact-title" className="contact-label">
        {contact.label}
      </h2>
      <h3 className="contact-email" data-content-status={contact.email.status}>
        {contact.email.status === "ready" ? <a href={`mailto:${email}`}>{email}</a> : email}
      </h3>
      <span className="contact-marker" aria-hidden="true" />
    </section>
  );
}
