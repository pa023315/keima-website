import Image from "next/image";

import { MediaPlaceholder } from "@/components/media-placeholder";
import type { ContentState, LocaleContent, ServiceContent } from "@/content/site-content";

type ServicesProps = {
  content: LocaleContent;
};

function contentValue(state: ContentState<string>) {
  return state.status === "ready" ? state.value : state.label;
}

function safeServiceHref(value: string) {
  const href = value.trim();

  if (href.startsWith("/") && !href.startsWith("//")) {
    return href;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : null;
  } catch {
    return null;
  }
}

function ServiceItem({ service, locale }: { service: ServiceContent; locale: LocaleContent["locale"] }) {
  const labels =
    locale === "zh-TW"
      ? { status: "狀態", summary: "簡介", audience: "對象", url: "網址" }
      : { status: "Status", summary: "Summary", audience: "Audience", url: "URL" };
  const name = contentValue(service.name);
  const serviceHref = service.url.status === "ready" ? safeServiceHref(service.url.value) : null;

  return (
    <li className="service-item" data-content-status={service.status.status}>
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
        <h2 id="services-title" className="section-title">
          {content.servicesLabel}
        </h2>
      </div>

      <ol className="services-list">
        {content.services.map((service) => (
          <ServiceItem key={service.id} service={service} locale={content.locale} />
        ))}
      </ol>
    </section>
  );
}
