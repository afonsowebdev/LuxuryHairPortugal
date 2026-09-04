"use client";

import { PhoneIcon, InstagramIcon } from "@/components/ui/icons";
import { useAdminData } from "@/context/AdminDataContext";

export function ContactInfo() {
  const { settings: storeSettings } = useAdminData();
  return (
    <div className="flex flex-col gap-4 text-sm text-plum-dark/80">
      {storeSettings.brand.phones.map((phone) => (
        <a
          key={phone}
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-3 hover:text-bordeaux"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-plum-dark/5">
            <PhoneIcon className="h-4 w-4" />
          </span>
          {phone}
        </a>
      ))}
      <a
        href={storeSettings.brand.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 hover:text-bordeaux"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-plum-dark/5">
          <InstagramIcon className="h-4 w-4" />
        </span>
        {storeSettings.brand.instagram}
      </a>
      <p className="mt-2 text-xs text-plum-dark/50">
        Horário de atendimento: Segunda a Sexta, 9h-18h (hora de Lisboa). Respostas via Instagram
        costumam ser mais rápidas.
      </p>
    </div>
  );
}
