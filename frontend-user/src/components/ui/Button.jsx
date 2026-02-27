/**
 * Button — Composant réutilisable avec variantes Netflix
 *
 * Variantes :
 *  - primary  : rouge Netflix (#e50914) — boutons d'action principaux
 *  - secondary: gris semi-transparent — boutons secondaires
 *  - white    : blanc avec texte noir — bouton "Lecture"
 *  - icon     : rond, transparent — boutons icônes (+, info, like)
 *
 * Tailwind 4.1 : utilise les couleurs @theme (bg-primary, bg-primary-hover)
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded transition-all duration-200 cursor-pointer select-none";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover active:bg-primary-dark",
    secondary:
      "bg-netflix-gray/60 text-white hover:bg-netflix-gray active:bg-netflix-gray/80 backdrop-blur-sm",
    white:
      "bg-white text-netflix-black hover:bg-netflix-light active:bg-gray-300",
    icon: "bg-netflix-gray/40 text-white border border-white/30 hover:border-white hover:bg-netflix-gray/70 rounded-full p-2",
  };

  return (
    <button
      className={`${base} ${variant !== "icon" ? sizes[size] : ""} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
