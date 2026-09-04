import type { CSSProperties } from "react";

type IconProps = { className?: string };

/**
 * Boxicons are font glyphs, not SVGs with a viewBox — they don't respond to
 * Tailwind's height/width sizing. This reads the intended size out of the
 * className (Tailwind scale like `h-4` or arbitrary `h-[18px]`) and applies
 * it as a font-size instead, so every existing call site keeps working
 * unchanged.
 */
function sizeFromClassName(className: string): string {
  const arbitrary = className.match(/\b[hw]-\[(\d+(?:\.\d+)?)(px|rem|em)\]/);
  if (arbitrary) return `${arbitrary[1]}${arbitrary[2]}`;
  const scale = className.match(/\b[hw]-(\d+(?:\.\d+)?)\b/);
  if (scale) return `${parseFloat(scale[1]) * 4}px`;
  return "1em";
}

export function BxIcon({
  name,
  className = "",
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <i
      className={`bx ${name} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        fontSize: sizeFromClassName(className),
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function InstagramIcon({ className }: IconProps) {
  return <BxIcon name="bxl-instagram" className={className} />;
}

export function PhoneIcon({ className }: IconProps) {
  return <BxIcon name="bx-phone" className={className} />;
}

export function MenuIcon({ className }: IconProps) {
  return <BxIcon name="bx-menu" className={className} />;
}

export function CloseIcon({ className }: IconProps) {
  return <BxIcon name="bx-x" className={className} />;
}

export function ChevronDownIcon({ className }: IconProps) {
  return <BxIcon name="bx-chevron-down" className={className} />;
}

export function TrashIcon({ className }: IconProps) {
  return <BxIcon name="bx-trash" className={className} />;
}

export function CheckIcon({ className }: IconProps) {
  return <BxIcon name="bx-check" className={className} />;
}

export function CopyIcon({ className }: IconProps) {
  return <BxIcon name="bx-copy" className={className} />;
}

export function DashboardIcon({ className }: IconProps) {
  return <BxIcon name="bx-grid-alt" className={className} />;
}

export function BoxIcon({ className }: IconProps) {
  return <BxIcon name="bx-package" className={className} />;
}

export function ClipboardIcon({ className }: IconProps) {
  return <BxIcon name="bx-clipboard" className={className} />;
}

export function UsersIcon({ className }: IconProps) {
  return <BxIcon name="bx-group" className={className} />;
}

export function SettingsIcon({ className }: IconProps) {
  return <BxIcon name="bx-cog" className={className} />;
}

export function LogoutIcon({ className }: IconProps) {
  return <BxIcon name="bx-log-out" className={className} />;
}

export function PlusIcon({ className }: IconProps) {
  return <BxIcon name="bx-plus" className={className} />;
}

export function EditIcon({ className }: IconProps) {
  return <BxIcon name="bx-edit-alt" className={className} />;
}

export function EyeIcon({ className }: IconProps) {
  return <BxIcon name="bx-show" className={className} />;
}

export function SearchIcon({ className }: IconProps) {
  return <BxIcon name="bx-search" className={className} />;
}

export function HeartIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  return <BxIcon name={filled ? "bxs-heart" : "bx-heart"} className={className} />;
}

export function CategoryIcon({ className }: IconProps) {
  return <BxIcon name="bx-category" className={className} />;
}

export function TagIcon({ className }: IconProps) {
  return <BxIcon name="bx-purchase-tag" className={className} />;
}

export function MailIcon({ className }: IconProps) {
  return <BxIcon name="bx-envelope" className={className} />;
}

export function MailOpenIcon({ className }: IconProps) {
  return <BxIcon name="bx-envelope-open" className={className} />;
}

export function DownloadIcon({ className }: IconProps) {
  return <BxIcon name="bx-download" className={className} />;
}

export function ImageIcon({ className }: IconProps) {
  return <BxIcon name="bx-image" className={className} />;
}

export function CalendarIcon({ className }: IconProps) {
  return <BxIcon name="bx-calendar" className={className} />;
}

export function TrendingUpIcon({ className }: IconProps) {
  return <BxIcon name="bx-trending-up" className={className} />;
}

export function StarIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  return <BxIcon name={filled ? "bxs-star" : "bx-star"} className={className} />;
}
