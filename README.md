# Portafolio personal

Portafolio responsive en **HTML, CSS y JavaScript puro** (sin frameworks ni compilación): hero con aurora animada, proyectos generados desde un array en `script.js`, habilidades agrupadas por categorías, tema oscuro/claro con preferencia recordada y animaciones a 60 fps que respetan `prefers-reduced-motion`.

## Estructura

- `index.html` — contenido semántico y accesible
- `styles.css` — tema oscuro/claro con variables CSS, mobile-first
- `script.js` — array `projects`, tilt 3D, reveal on scroll, menú móvil
- `favicon.svg` / `avatar.svg` — icono y foto de perfil (sustituibles)

## Ver en local

Abre `index.html` en el navegador. Sin servidor ni instalación.

## Publicar en GitHub Pages

1. Crea un repositorio y sube estos archivos a la rama `main`.
2. En el repo: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**.
3. Tu sitio quedará en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.
4. (Opcional) Para previsualizaciones ricas en redes, pon la URL absoluta final en `og:url`, `og:image` y `twitter:image` de `index.html`.

## Personalizar

Edita los bloques marcados con `EDITA AQUÍ` en `index.html`, el array `projects` en `script.js` y la variable `--accent` en `styles.css`.
