import Image from "next/image";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { Reveal } from "@/components/motion/reveal";
import type { ContentState, LocaleContent, ServiceContent } from "@/content/site-content";

type ServicesProps = {
  content: LocaleContent;
};

const trustedServiceOrigin = "https://keima.invalid";
const absoluteUrlPattern = /^[a-z][a-z\d+.-]*:/i;
const rawUnsafeUrlCharacterPattern = /[\u0000-\u001f\u007f\\\s]/;
const encodedUnsafeUrlCharacterPattern = /%(?:0[\da-f]|1[\da-f]|5c|7f)/i;

function contentValue(state: ContentState<string>) {
  return state.status === "ready" ? state.value : state.label;
}

function safeServiceHref(value: string) {
  if (
    value.length === 0 ||
    value !== value.trim() ||
    value.startsWith("//") ||
    rawUnsafeUrlCharacterPattern.test(value) ||
    encodedUnsafeUrlCharacterPattern.test(value)
  ) {
    return null;
  }

  try {
    const url = new URL(value, trustedServiceOrigin);

    if (absoluteUrlPattern.test(value)) {
      return url.protocol === "https:" ? url.href : null;
    }

    if (url.origin !== trustedServiceOrigin) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function ServiceItem({
  service,
  locale,
  revealDelay,
}: {
  service: ServiceContent;
  locale: LocaleContent["locale"];
  revealDelay: number;
}) {
  const labels =
    locale === "zh-TW"
      ? { status: "狀態", summary: "簡介", audience: "對象", url: "網址" }
      : { status: "Status", summary: "Summary", audience: "Audience", url: "URL" };
  const name = contentValue(service.name);
  const serviceHref = service.url.status === "ready" ? safeServiceHref(service.url.value) : null;

  return (
    <li
      className="service-item"
      data-content-status={service.status.status}
      data-motion-accent="service-card"
    >
      <Reveal className="service-reveal" delay={revealDelay}>
      <div className="service-heading">
        <span className="service-index" aria-hidden="true">
          {service.index}
        </span>
        <h3>{name}</h3>
      </div>

      <div className="service-media">
        {service.image.status === "ready" ? (
          <Image
            className="editorial-image"
            src={service.image.value}
            alt={name}
            width="1200"
            height="750"
            unoptimized
          />
        ) : (
          <MediaPlaceholder label={service.image.label} />
        )}
      </div>

      <dl className="service-details">
        <div>
          <dt>{labels.status}</dt>
          <dd>{contentValue(service.status)}</dd>
        </div>
        <div>
          <dt>{labels.summary}</dt>
          <dd>{contentValue(service.summary)}</dd>
        </div>
        <div>
          <dt>{labels.audience}</dt>
          <dd>{contentValue(service.audience)}</dd>
        </div>
        <div>
          <dt>{labels.url}</dt>
          <dd>
            {service.url.status === "ready" && serviceHref ? (
              <a href={serviceHref}>{service.url.value}</a>
            ) : (
              contentValue(service.url)
            )}
          </dd>
        </div>
      </dl>
      </Reveal>
    </li>
  );
}

export function Services({ content }: ServicesProps) {
  return (
    <section
      id="services"
      className="content-section section-grid services"
      aria-labelledby="services-title"
    >
      <div className="services-intro">
        <p className="section-index" aria-hidden="true">
          <span>03</span>
        </p>
        <Reveal>
          <h2 id="services-title" className="section-title">
            {content.servicesLabel}
          </h2>
        </Reveal>
      </div>

      <ol className="services-list">
        {content.services.map((service, index) => (
          <ServiceItem
            key={service.id}
            service={service}
            locale={content.locale}
            revealDelay={index * 0.08}
          />
        ))}
      </ol>
    </section>
  );
}
