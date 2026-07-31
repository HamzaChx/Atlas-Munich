/**
 * Repeating diamond lattice — evokes mashrabiya wooden screens.
 * The one piece of geometry the design keeps: used as a barely-there
 * background texture, never as foreground decoration.
 */
export function MashrabiyaPattern({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg width="100%" height="100%" className="h-full w-full">
        <defs>
          <pattern id="mashrabiya" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M20,0 L40,20 L20,40 L0,20 Z"
              fill="none"
              strokeWidth="0.5"
              className="stroke-current"
            />
            <path
              d="M20,8 L32,20 L20,32 L8,20 Z"
              fill="none"
              strokeWidth="0.5"
              className="stroke-current"
            />
            <circle cx="20" cy="20" r="1.5" className="fill-current" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mashrabiya)" />
      </svg>
    </div>
  );
}
