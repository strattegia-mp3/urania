export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="component-gradient"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="32" fill="url(#component-gradient)" />

      {/* Vento/Nuvem Stylized */}
      <path
        d="M14 32C14 23.5 19.5 16 28 14.5C28 14.5 26 19 29 22C32 25 36.5 24 36.5 24C35.5 28 38 31 42 31.5H48C50 31.5 52 33.5 52 36C52 42 46 48 38 48H26C18 48 14 42 14 36V32Z"
        fill="currentColor"
        className="text-white dark:text-white/90"
      />

      {/* Estrela */}
      <circle
        cx="46"
        cy="18"
        r="3"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  );
}
