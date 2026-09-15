import type { Mood } from '../types';

interface PlantProps {
  date: string;
  mood?: Mood;
  active?: boolean;
  future?: boolean;
  size?: number;
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const moodPalette: Record<Mood, { petal: string; accent: string }> = {
  1: { petal: '#8fa1d1', accent: '#5f73a8' },
  2: { petal: '#8bb1bb', accent: '#5f8a94' },
  3: { petal: '#e2ba6d', accent: '#b58838' },
  4: { petal: '#e6a087', accent: '#c8775f' },
  5: { petal: '#c98ab2', accent: '#9e5f87' }
};

export function Plant({ date, mood, active = false, future = false, size = 34 }: PlantProps) {
  const seed = hash(date);
  const stemX = 21 + (seed % 5) - 2;
  const bloomY = 9 + (seed % 7);
  const leafBaseY = 22 + (seed % 5);
  const petals = 5 + (seed % 4);
  const petalLength = 4.4 + (seed % 3);
  const branchTilt = ((seed % 7) - 3) * 0.6;
  const palette = mood ? moodPalette[mood] : { petal: '#beb9ae', accent: '#938f84' };
  const opacity = future ? 0.16 : active ? 1 : mood ? 0.92 : 0.45;
  const blossom = Array.from({ length: petals }, (_, index) => {
    const angle = (-Math.PI / 2) + ((Math.PI * 2) / petals) * index;
    const cx = stemX + Math.cos(angle) * 4.8;
    const cy = bloomY + Math.sin(angle) * 4.8;
    const rx = 2.4 + ((seed + index) % 3) * 0.35;
    const ry = petalLength;
    return <ellipse key={index} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${(angle * 180) / Math.PI + 90} ${cx} ${cy})`} fill={palette.petal} opacity="0.96" />;
  });

  return (
    <svg width={size} height={size} viewBox="0 0 44 44" role="img" aria-label={mood ? `Planta del día, ánimo ${mood}` : 'Día sin recuerdo'} style={{ opacity }}>
      <defs>
        <linearGradient id={`stem-${seed}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6d825f" />
          <stop offset="100%" stopColor="#4f6444" />
        </linearGradient>
      </defs>
      <path d={`M${stemX} 36 C${stemX - 2.5} 30 ${stemX + branchTilt} 21 ${stemX} ${bloomY + 5}`} fill="none" stroke={`url(#stem-${seed})`} strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M${stemX - 1} ${leafBaseY} C${stemX - 9} ${leafBaseY - 4} ${stemX - 10} ${leafBaseY - 10} ${stemX - 1.3} ${leafBaseY - 7}`} fill="#8daf7f" opacity="0.95" />
      <path d={`M${stemX + 1.2} ${leafBaseY - 4} C${stemX + 10} ${leafBaseY - 7} ${stemX + 11} ${leafBaseY - 13} ${stemX + 1.5} ${leafBaseY - 9}`} fill="#7e9c71" opacity="0.93" />
      <path d={`M${stemX - 0.3} ${leafBaseY + 5} C${stemX - 7} ${leafBaseY + 2} ${stemX - 8} ${leafBaseY - 2} ${stemX - 0.4} ${leafBaseY}`} fill="#91b385" opacity="0.7" />
      {mood ? (
        <g>
          {blossom}
          <circle cx={stemX} cy={bloomY} r="2.9" fill={palette.accent} />
          <circle cx={stemX - 0.8} cy={bloomY - 0.8} r="0.8" fill="#fff7ef" opacity="0.72" />
        </g>
      ) : (
        <g>
          <ellipse cx={stemX} cy={bloomY + 1.2} rx="3.7" ry="4.8" fill="#b7b1a6" />
          <circle cx={stemX} cy={bloomY - 1.2} r="1.25" fill="#948e82" />
        </g>
      )}
      <path d="M9 37.4 C16 35.8 28 35.7 35 37.7" fill="none" stroke="#d0c5b3" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
