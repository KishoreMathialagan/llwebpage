import type { Project } from '../data/content'

/**
 * Each composition is art-directed for the aspect ratio it appears in,
 * so nothing important is lost when the card crops on smaller screens.
 */
export function ProjectArt({ variant }: { variant: Project['art'] }) {
  if (variant === 'aurelia') {
    return (
      <svg className="project-svg" data-cursor-theme="light" viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Aurelia concept identity composition">
        <rect width="1000" height="750" fill="#E7E0D0" />
        <g stroke="#14150F" strokeOpacity="0.09">
          <path d="M0 150H1000M0 300H1000M0 450H1000M0 600H1000" />
          <path d="M200 0V750M400 0V750M600 0V750M800 0V750" />
        </g>
        <text x="72" y="86" fill="#14150F" fontFamily="Manrope, sans-serif" fontSize="17" letterSpacing="7">AURELIA</text>
        <text x="928" y="86" fill="#14150F" fontFamily="Manrope, sans-serif" fontSize="12" letterSpacing="3" textAnchor="end" opacity="0.55">IDENTITY / 01</text>
        <ellipse cx="560" cy="385" rx="360" ry="132" fill="none" stroke="#A9C23C" strokeWidth="2" transform="rotate(-19 560 385)" />
        <circle cx="866" cy="247" r="7" fill="#A9C23C" />
        <text x="120" y="610" fill="#14150F" fontFamily="'Instrument Serif', Georgia, serif" fontSize="560" letterSpacing="-30">A</text>
        <text x="72" y="680" fill="#14150F" fontFamily="Manrope, sans-serif" fontSize="13" letterSpacing="4" opacity="0.62">RITUAL / SKIN / OBJECTS</text>
        <text x="928" y="680" fill="#14150F" fontFamily="Manrope, sans-serif" fontSize="13" letterSpacing="4" textAnchor="end" opacity="0.62">CONCEPT — 2026</text>
        <path d="M72 112H260" stroke="#14150F" strokeOpacity="0.4" />
      </svg>
    )
  }

  if (variant === 'northline') {
    return (
      <svg className="project-svg" viewBox="0 0 750 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Northline concept campaign composition">
        <defs>
          <radialGradient id="nlGlow" cx="52%" cy="46%" r="52%">
            <stop offset="0%" stopColor="#D6F36A" stopOpacity="0.3" />
            <stop offset="58%" stopColor="#D6F36A" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#D6F36A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nlChrome" cx="35%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#F3F1E9" />
            <stop offset="30%" stopColor="#B3B6AA" />
            <stop offset="68%" stopColor="#3B3F36" />
            <stop offset="100%" stopColor="#0E100D" />
          </radialGradient>
          <linearGradient id="nlFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080909" stopOpacity="0" />
            <stop offset="100%" stopColor="#080909" stopOpacity="0.92" />
          </linearGradient>
        </defs>
        <rect width="750" height="1000" fill="#0A0C0A" />
        <rect width="750" height="1000" fill="url(#nlGlow)" />
        <g stroke="#D6F36A" strokeOpacity="0.4" fill="none">
          <ellipse cx="385" cy="450" rx="315" ry="112" transform="rotate(-14 385 450)" />
          <ellipse cx="385" cy="450" rx="330" ry="200" transform="rotate(38 385 450)" strokeOpacity="0.17" />
          <ellipse cx="385" cy="450" rx="345" ry="285" transform="rotate(-54 385 450)" strokeOpacity="0.1" />
        </g>
        <circle cx="385" cy="450" r="196" fill="url(#nlChrome)" />
        <ellipse cx="320" cy="372" rx="72" ry="30" fill="#F3F1E9" opacity="0.22" transform="rotate(-28 320 372)" />
        <circle cx="600" cy="260" r="4" fill="#D6F36A" />
        <g stroke="#F3F1E9" strokeOpacity="0.24">
          <path d="M54 262V360M70 262V360M86 262V360M102 262V360M118 262V360" />
        </g>
        <g stroke="#D6F36A" strokeWidth="2">
          <path d="M54 360H118" />
          <path d="M54 360V344" />
          <path d="M118 360V338" />
        </g>
        <text x="54" y="80" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="14" letterSpacing="5">NORTHLINE</text>
        <text x="54" y="108" fill="#D6F36A" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3.5">PERFORMANCE / SYSTEMS</text>
        <text x="696" y="80" fill="#6E716B" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3" textAnchor="end">02 / B2B</text>
        <rect y="700" width="750" height="300" fill="url(#nlFade)" />
        <text x="54" y="806" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="76" fontWeight="300" letterSpacing="-4">Northline</text>
        <path d="M54 834H696" stroke="#F3F1E9" strokeOpacity="0.18" />
        <text x="54" y="868" fill="#A6A79F" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="2.4">COMPLEX OFFER. CLEAR DEMAND.</text>
        <text x="696" y="868" fill="#6E716B" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="2.4" textAnchor="end">CONCEPT / DEMAND GEN</text>
        <text x="54" y="944" fill="#6E716B" fontFamily="Manrope, sans-serif" fontSize="9" letterSpacing="2.2">PAID SEARCH / PAID SOCIAL / QUALIFICATION</text>
      </svg>
    )
  }

  if (variant === 'marrow') {
    return (
      <svg className="project-svg" viewBox="0 0 900 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Marrow concept social content composition">
        <defs>
          <radialGradient id="mwLight" cx="52%" cy="38%" r="56%">
            <stop offset="0%" stopColor="#F3F1E9" stopOpacity="0.3" />
            <stop offset="68%" stopColor="#F3F1E9" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#F3F1E9" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="900" height="900" fill="#8C3E26" />
        <rect width="900" height="900" fill="url(#mwLight)" />
        <g fill="none" stroke="#F3F1E9" strokeOpacity="0.26">
          <circle cx="450" cy="430" r="250" />
          <circle cx="450" cy="430" r="324" />
          <path d="M126 430H774M450 106V754" strokeOpacity="0.11" />
        </g>
        <text x="450" y="600" fill="#F3F1E9" fontFamily="'Instrument Serif', Georgia, serif" fontSize="470" textAnchor="middle" opacity="0.95">M</text>
        <text x="515" y="545" fill="#58200F" fontFamily="'Instrument Serif', Georgia, serif" fontSize="390" textAnchor="middle" opacity="0.72">M</text>
        <circle cx="700" cy="430" r="10" fill="#D6F36A" />
        <text x="56" y="76" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="15" letterSpacing="7">MARROW</text>
        <text x="56" y="102" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3.4" opacity="0.66">FIRE / TABLE / STORY</text>
        <text x="844" y="76" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3.4" textAnchor="end" opacity="0.66">SOCIAL / CONTENT</text>
        <path d="M56 790H390" stroke="#F3F1E9" strokeOpacity="0.38" />
        <text x="56" y="828" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="12" letterSpacing="3.6" opacity="0.8">CLOSE CROPS. OPEN FLAME.</text>
        <text x="844" y="828" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="2.8" textAnchor="end" opacity="0.5">CONCEPT / HOSPITALITY</text>
      </svg>
    )
  }

  return (
    <svg className="project-svg" viewBox="0 0 1000 625" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Fieldwork concept website composition">
      <defs>
        <linearGradient id="fwChrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3F1E9" stopOpacity="0.85" />
          <stop offset="38%" stopColor="#6E716B" stopOpacity="0.5" />
          <stop offset="68%" stopColor="#D6F36A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F3F1E9" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="fwFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E100E" stopOpacity="0" />
          <stop offset="100%" stopColor="#0E100E" stopOpacity="0.94" />
        </linearGradient>
      </defs>
      <rect width="1000" height="625" fill="#141714" />
      <g stroke="#F3F1E9" strokeOpacity="0.12">
        <path d="M0 392L500 272L1000 392" />
        <path d="M0 442L500 322L1000 442" />
        <path d="M0 492L500 372L1000 492" />
        <path d="M0 542L500 422L1000 542" />
        <path d="M0 592L500 472L1000 592" />
        <path d="M500 272V625M300 392V625M150 462V625M700 392V625M850 462V625" strokeOpacity="0.06" />
      </g>
      <ellipse cx="520" cy="280" rx="272" ry="158" fill="none" stroke="url(#fwChrome)" strokeWidth="24" />
      <ellipse cx="520" cy="280" rx="272" ry="158" fill="none" stroke="#F3F1E9" strokeOpacity="0.18" strokeWidth="1" />
      <ellipse cx="520" cy="280" rx="196" ry="110" fill="none" stroke="url(#fwChrome)" strokeWidth="5" opacity="0.65" />
      <text x="54" y="70" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="13" letterSpacing="5.5">FIELDWORK</text>
      <text x="54" y="94" fill="#A6A79F" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3.2">ARCHITECTURE / INTERIORS</text>
      <g stroke="#D6F36A" strokeOpacity="0.7">
        <path d="M790 72H944M790 66V78M944 66V78" />
      </g>
      <text x="867" y="60" fill="#D6F36A" fontFamily="Manrope, sans-serif" fontSize="9" letterSpacing="2.6" textAnchor="middle">SPACE / 01</text>
      <rect y="430" width="1000" height="195" fill="url(#fwFade)" />
      <text x="54" y="558" fill="#F3F1E9" fontFamily="Manrope, sans-serif" fontSize="72" fontWeight="300" letterSpacing="-3.5">Fieldwork</text>
      <text x="56" y="590" fill="#A6A79F" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="2.8">A DIGITAL FLOOR PLAN</text>
      <text x="944" y="590" fill="#6E716B" fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="2.8" textAnchor="end">CONCEPT / WEB</text>
    </svg>
  )
}
