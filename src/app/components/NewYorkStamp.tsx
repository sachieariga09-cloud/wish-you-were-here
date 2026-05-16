interface LandmarkStampProps {
  variant: 'liberty' | 'empire-state';
  className?: string;
  style?: React.CSSProperties;
}

function LandmarkStamp({ variant, className, style }: LandmarkStampProps) {
  const ink = '#1a3348';

  return (
    <div className={className} style={style} aria-hidden>
      <svg viewBox="0 0 88 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
        <rect x="4" y="4" width="80" height="100" rx="2" fill="#f4f0e6" stroke={ink} strokeWidth="1.5" opacity="0.9" />
        <rect x="7" y="7" width="74" height="94" stroke={ink} strokeWidth="0.75" opacity="0.45" />

        <text
          x="44"
          y="18"
          textAnchor="middle"
          fill={ink}
          fontSize="7"
          fontWeight="700"
          letterSpacing="0.14em"
          opacity="0.9"
        >
          NEW YORK
        </text>

        {variant === 'liberty' ? (
          <g transform="translate(44 57)" opacity="0.9">
            <path
              fill={ink}
              d="M8-26 L10-20 L6-14 L8-8 L4-4 L0-6 L-6-2 L-8-8 L-6-14 L-10-20 L-8-26 L-2-24 L0-18 L2-10 L0-4 L-2 2 L-4 10 L-6 18 L-8 24 L-12 26 L-14 30 L14 30 L12 26 Z"
            />
            <path fill={ink} d="M-16 30 H16 V34 H-16 Z M-12 34 H12 V37 H-12 Z" />
            <circle cx="9" cy="-28" r="2.5" fill={ink} opacity="0.75" />
            <path fill={ink} d="M9-28 L9-34" stroke={ink} strokeWidth="1.2" />
          </g>
        ) : (
          <g transform="translate(44 55)" opacity="0.9">
            <path
              fill={ink}
              d="M-18 28 V-4 L-14 -12 L-10 -16 L-6 -20 L-2 -22 L2 -22 L6 -20 L10 -16 L14 -12 L18 -4 V28 Z"
            />
            <path fill={ink} d="M-3 -22 L0 -30 L3 -22 Z" />
            <path fill={ink} d="M-12 28 H12 V31 H-12 Z M-20 31 H20 V34 H-20 Z" opacity="0.85" />
            <rect x="-1.5" y="0" width="3" height="18" fill="#f4f0e6" opacity="0.25" />
          </g>
        )}

        <text x="44" y="88" textAnchor="middle" fill={ink} fontSize="8" fontWeight="700" opacity="0.9">
          50¢
        </text>
        <text
          x="44"
          y="98"
          textAnchor="middle"
          fill={ink}
          fontSize="6"
          fontWeight="600"
          letterSpacing="0.06em"
          opacity="0.85"
        >
          {variant === 'liberty' ? 'LIBERTY' : 'EMPIRE STATE'}
        </text>
      </svg>
    </div>
  );
}

interface NewYorkLandmarkStampsProps {
  className?: string;
  style?: React.CSSProperties;
}

export function NewYorkLandmarkStamps({ className, style }: NewYorkLandmarkStampsProps) {
  return (
    <div className={className} style={style} aria-hidden>
      <LandmarkStamp
        variant="liberty"
        className="pointer-events-none absolute mix-blend-multiply"
        style={{
          left: 0,
          top: 0,
          width: 88,
          height: 108,
          transform: 'rotate(-7deg)',
          opacity: 0.93,
        }}
      />
      <LandmarkStamp
        variant="empire-state"
        className="pointer-events-none absolute mix-blend-multiply"
        style={{
          left: 78,
          top: 14,
          width: 88,
          height: 108,
          transform: 'rotate(5deg)',
          opacity: 0.93,
        }}
      />
    </div>
  );
}

export function NewYorkStamp(props: NewYorkLandmarkStampsProps) {
  return <NewYorkLandmarkStamps {...props} />;
}
