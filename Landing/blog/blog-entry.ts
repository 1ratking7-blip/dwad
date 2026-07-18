// Static blog pages are plain HTML (no React/hydration — faster, trivially crawlable).
// This entry exists only so Vite/PostCSS/Tailwind process the same stylesheet as the main
// app, keeping visual language identical without duplicating CSS by hand.
import '../src/index.css';
