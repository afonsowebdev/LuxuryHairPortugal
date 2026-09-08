"use client";

import { PhoneIcon, InstagramIcon, MailIcon, ClockIcon } from "@/components/ui/icons";
import { useAdminData } from "@/context/AdminDataContext";

function ContactRow({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/10 text-gold transition-colors group-hover:bg-gold group-hover:text-plum-dark">
        {icon}
      </span>
      <span className="text-sm text-cream/90">{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group flex items-center gap-4 rounded-xl px-1 py-1 transition-colors hover:text-gold"
      >
        {content}
      </a>
    );
  }
  return <div className="flex items-center gap-4 px-1 py-1">{content}</div>;
}

export function ContactInfo() {
  const { settings: storeSettings } = useAdminData();
  return (
    <div className="flex flex-col gap-8 rounded-3xl bg-plum-dark px-7 py-8 text-cream shadow-lg sm:px-9 sm:py-10">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light/80">
          Fale Connosco
        </span>
        <p className="mt-3 font-serif text-lg italic text-cream/80">
          &ldquo;{storeSettings.brand.tagline}&rdquo;
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {storeSettings.brand.phones.map((phone) => (
          <ContactRow
            key={phone}
            icon={<PhoneIcon className="h-4 w-4" />}
            label={phone}
            href={`tel:${phone.replace(/\s/g, "")}`}
          />
        ))}
        <ContactRow
          icon={<MailIcon className="h-4 w-4" />}
          label={storeSettings.brand.email}
          href={`mailto:${storeSettings.brand.email}`}
        />
        <ContactRow
          icon={<InstagramIcon className="h-4 w-4" />}
          label={storeSettings.brand.instagram}
          href={storeSettings.brand.instagramUrl}
        />
        <ContactRow
          icon={<ClockIcon className="h-4 w-4" />}
          label="Seg a Sex, 9h-18h (hora de Lisboa)"
        />
      </div>

      <p className="border-t border-cream/10 pt-5 text-xs leading-relaxed text-cream/50">
        Respostas via Instagram costumam ser mais rápidas. Para questões sobre encomendas já
        efetuadas, tenha o número de referência à mão.
      </p>
    </div>
  );
}
