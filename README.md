# Portafolio personal

Portafolio responsive en **HTML, CSS y JavaScript puro** (sin frameworks ni compilación): hero con aurora animada, proyectos generados desde un array en `script.js`, habilidades agrupadas por categorías, tema oscuro/claro con preferencia recordada y animaciones a 60 fps que respetan `prefers-reduced-motion`.

## Estructura

- `index.html` — contenido semántico y accesible
- `styles.css` — tema oscuro/claro con variables CSS, mobile-first
- `script.js` — array `projects`, tilt 3D, reveal on scroll, menú móvil
- `favicon.svg` / `avatar.svg` — icono y foto de perfil (sustituibles)
- `og-image.png` — portada 1200x630 para redes sociales

## Ver en local

Abre `index.html` en el navegador. Sin servidor ni instalación.

## Publicar en Netlify

1. Sube estos archivos al repositorio (o arrastra la carpeta a https://app.netlify.com/drop).
2. El sitio queda en `https://rxggxr.netlify.app/` (las rutas son relativas, funcionan desde la raíz).
3. Tras publicar, verifica `https://rxggxr.netlify.app/sitemap.xml` y `https://rxggxr.netlify.app/robots.txt`.

## Personalizar

Edita los bloques marcados con `EDITA AQUÍ` en `index.html`, el array `projects` en `script.js` y la variable `--accent` en `styles.css`.
