import { MapPin } from "lucide-react";

export default function MapButton({
  href,
  label = "Get Directions",
  variant = "dark",
  solid = false,
  className = "",
}: {
  href: string;
  label?: string;
  variant?: "dark" | "light";
  solid?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-gold ${variant === "light" ? "on-light" : ""} ${solid ? "solid" : ""} ${className}`}
    >
      <MapPin className="h-4 w-4" aria-hidden />
      {label}
      <span className="sr-only">(opens Google Maps)</span>
    </a>
  );
}
