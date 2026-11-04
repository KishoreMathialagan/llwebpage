# LeadLoom

An editorial single-page site for a fictional digital growth agency, built with React, TypeScript,
Vite, Three.js / React Three Fiber and GSAP.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Form handling

The enquiry form is deliberately honest: it never shows a success message unless a submission
endpoint is configured.

1. Copy `.env.example` to `.env`.
2. Set `VITE_FORM_ENDPOINT` to a URL that accepts a JSON `POST`.
3. Deploy.

Without an endpoint the form validates locally and offers a prefilled `mailto:` link instead of
pretending anything was sent.

## Before going live

- Replace the placeholder address in `src/data/content.ts` (`SITE.email`) and the social profile
  URLs with real destinations.
- Set `VITE_FORM_ENDPOINT`.
- Update the canonical/OG URLs in `index.html` if the domain changes.
- The four projects are self-initiated demonstration concepts. Replace them with real work only
  when the case studies and permissions exist.

## Notes

- Fonts are self-hosted in `public/fonts` (Manrope + Instrument Serif).
- The 3D hero is split into a lazy-loaded chunk. A static SVG orbit renders behind it and remains
  when WebGL is unavailable.
- Motion respects `prefers-reduced-motion`; the custom cursor is disabled on touch devices.
# llwebpage
# llwebpage
