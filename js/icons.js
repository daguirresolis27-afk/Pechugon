/* Ilustraciones planas al estilo de la carta (contorno negro, colores de marca). */
const ICONS = (() => {
  const s = 'stroke="#141414" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"';
  return {
    pizza: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="#E89A3C" ${s}/>
      <circle cx="50" cy="50" r="36" fill="#FFD24D" ${s}/>
      <path d="M50 14v72M18.8 32l62.4 36M18.8 68l62.4-36" fill="none" ${s} stroke-width="2.5"/>
      <circle cx="36" cy="30" r="7" fill="#E3262E" ${s} stroke-width="2.5"/>
      <circle cx="66" cy="34" r="6" fill="#E3262E" ${s} stroke-width="2.5"/>
      <circle cx="30" cy="60" r="6" fill="#E3262E" ${s} stroke-width="2.5"/>
      <circle cx="64" cy="66" r="7" fill="#E3262E" ${s} stroke-width="2.5"/>
      <circle cx="50" cy="50" r="5" fill="#E3262E" ${s} stroke-width="2.5"/>
      <ellipse cx="52" cy="24" rx="5" ry="2.6" transform="rotate(-25 52 24)" fill="#3FA34D" ${s} stroke-width="2"/>
    </svg>`,
    burger: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M14 46c0-18 16-28 36-28s36 10 36 28z" fill="#F0A646" ${s}/>
      <ellipse cx="38" cy="30" rx="3.5" ry="2" fill="#FFF3DC"/><ellipse cx="56" cy="27" rx="3.5" ry="2" fill="#FFF3DC"/><ellipse cx="66" cy="36" rx="3.5" ry="2" fill="#FFF3DC"/><ellipse cx="46" cy="38" rx="3.5" ry="2" fill="#FFF3DC"/>
      <path d="M10 48h80v6c-6 4-10-2-16 2s-10-2-16 2-10-2-16 2-10-2-16 2-10-2-16 0z" fill="#4CB050" ${s}/>
      <path d="M14 58h72l-8 8-6-6-30 0-6 6z" fill="#FFD24D" ${s}/>
      <rect x="12" y="60" width="76" height="12" rx="6" fill="#7A3D1C" ${s}/>
      <path d="M16 74h68v4c0 6-4 10-10 10H26c-6 0-10-4-10-10z" fill="#F0A646" ${s}/>
    </svg>`,
    fries: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <g fill="#FFD24D" ${s}>
        <rect x="27" y="14" width="8" height="44" rx="2" transform="rotate(-10 31 36)"/>
        <rect x="38" y="10" width="8" height="48" rx="2" transform="rotate(-3 42 34)"/>
        <rect x="49" y="8" width="8" height="50" rx="2"/>
        <rect x="60" y="11" width="8" height="47" rx="2" transform="rotate(5 64 34)"/>
        <rect x="69" y="17" width="8" height="42" rx="2" transform="rotate(12 73 38)"/>
      </g>
      <path d="M22 42h56l-6 48H28z" fill="#E3262E" ${s}/>
      <circle cx="50" cy="64" r="9" fill="#FFD24D" ${s}/>
      <g fill="#C62A25" ${s} stroke-width="2.5">
        <path d="M70 60c4-3 9 0 9 4s-4 6-7 6"/>
      </g>
    </svg>`,
    chicken: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M58 16c16 0 28 12 26 28-2 14-14 22-26 24l-10 2-6 6-8-8 6-6 2-10C44 32 46 16 58 16z" fill="#D9822B" ${s}/>
      <path d="M60 24c-6 2-8 8-8 14M70 26c4 4 4 10 2 14M60 46c4 2 10 1 14-3" fill="none" ${s} stroke-width="2.5" stroke="#9A4F14"/>
      <path d="M36 70l-10 10" fill="none" stroke="#141414" stroke-width="12" stroke-linecap="round"/>
      <path d="M36 70l-10 10" fill="none" stroke="#FFF3DC" stroke-width="6" stroke-linecap="round"/>
      <circle cx="20" cy="80" r="7" fill="#FFF3DC" ${s}/>
      <circle cx="26" cy="88" r="7" fill="#FFF3DC" ${s}/>
    </svg>`,
    wings: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M18 54c-4-14 8-28 22-26 8 1 12 8 10 16-2 10-10 18-20 18-6 0-10-3-12-8z" fill="#C2410C" ${s}/>
      <path d="M48 70c-2-14 10-26 24-24 10 2 14 10 12 18-2 10-12 16-22 16-8 0-13-4-14-10z" fill="#D9822B" ${s}/>
      <path d="M50 26c4-10 16-14 26-8 6 4 6 12 0 16-8 6-18 4-24 0-2-2-3-5-2-8z" fill="#E89A3C" ${s}/>
      <path d="M28 40c-3 4-3 9 0 12M62 56c-3 3-3 8 0 11M62 22c4 0 8 2 10 5" fill="none" stroke="#7A3D1C" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    drink: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M56 6l-4 22" fill="none" ${s} stroke-width="5"/>
      <path d="M56 6l-4 22" fill="none" stroke="#E3262E" stroke-width="2"/>
      <path d="M26 26h48l-3 10H29z" fill="#E3262E" ${s}/>
      <path d="M29 36h42l-6 56H35z" fill="#FFD24D" ${s}/>
      <path d="M31 52h38l-1.4 14H32.4z" fill="#E3262E" ${s} stroke-width="2.5"/>
      <circle cx="44" cy="80" r="2.5" fill="#FFF3DC"/><circle cx="54" cy="74" r="2" fill="#FFF3DC"/>
    </svg>`,
    extra: `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 14c18 0 32 16 32 36s-14 36-32 36-32-16-32-36 14-36 32-36z" fill="#FFF8EC" ${s}/>
      <circle cx="54" cy="54" r="15" fill="#FFB800" ${s}/>
      <ellipse cx="49" cy="49" rx="4" ry="2.5" fill="#FFE38A"/>
    </svg>`,
  };
})();
