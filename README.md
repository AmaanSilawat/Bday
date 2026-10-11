# Princess (Chuchu) Birthday Website

A mobile-friendly romantic birthday website built with React, Vite, and plain CSS.

## Features
- Welcome screen with black-premium styling and animated stars
- Five-question interactive love game
- Each correct quiz answer immediately unlocks its matching Open When… envelope; incorrect answers can be retried
- Five personal letter modals, with locked/unlocked states
- Final birthday screen with CSS cake, candle flames, confetti, and love letter
- Responsive layout for phones and desktop
- Share button using the device share sheet where supported

## Run locally

Install Node.js (LTS), then in this folder run:

```bash
npm install
npm run dev
```

Open the local URL Vite prints in your terminal.

## Build for hosting

```bash
npm run build
npm run preview
```

The production website is generated in `dist/`.

## Deploy for free
### Vercel
1. Upload this project to a GitHub repository.
2. Import that repository at https://vercel.com/.
3. Framework preset: Vite.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy, then share the generated URL with Princess.

### Netlify
1. Upload the repository to GitHub and import it into Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`

## Personalize before sharing
Search `src/main.jsx` for:
- `const letters` — edit each Open When message.
- `const questions` — customize quiz questions and playful replies.
- `To my Princess (Chuchu)` and `Your person` — replace with your own words/sign-off.

## Notes
- The music icon is currently a preference/toggle UI only; no copyrighted audio is bundled. If you want music, add an audio file you have permission to use and connect it to the toggle.
- The letters are starter messages. Edit them to include your real memories and inside jokes.
- This is a client-side website; it does not store answers or send personal data to a server.
