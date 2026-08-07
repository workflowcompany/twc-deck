# TWC Deck — One Pager interactivo

Deck HTML interactivo de ventas para **The Workflow Company**. Pieza autoexplicativa para CEOs, gerentes generales y directores de operaciones de empresas 100+ colaboradores en Latam.

## Uso local

Abrir `index.html` con doble clic, o servir estáticamente:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Luego visitar `http://localhost:8080`.

## Deploy

Sitio estático, sin build step. Compatible con:

- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

## Estructura

```
twc-deck/
├── index.html      # 6 slides con copy definitivo
├── styles.css      # Design system blanco + rojo
├── app.js          # Navegación e interactividad
├── assets/
│   ├── logo-23.png              # Logo sobre fondo blanco
│   └── logo_fondo_rojo.png.png  # Logo sobre fondo rojo (CTA)
└── README.md
```

## Placeholders pendientes

Reemplazar en `index.html` y/o `assets/`:

| Placeholder | Ubicación | Acción |
|---|---|---|
| Logo TWC | Slide 1 (hero) | `assets/logo-twc.svg` |
| Logos clientes | Slide 9 | `assets/clients/` |
| Badge Partner Notion | Slide 9 | Asset oficial Notion |

## Navegación

- **Desktop:** flechas ← →, botones prev/next, dots de progreso
- **Móvil:** scroll vertical con snap por sección
- **CTA:** [cal.com/the-workflow-company/30min](https://cal.com/the-workflow-company/30min)

## Design system

| Token | HEX | Uso |
|---|---|---|
| `--twc-red` | `#EF003C` | Acentos, CTA, bordes, hovers |
| `--bg` | `#FFFFFF` | Fondo base |
| `--text` | `#0A0A0A` | Texto principal |

**Tipografías:** Chillax Bold (titulares) · Montserrat 400/500/600 (cuerpo)

## Licencia

Uso interno — The Workflow Company.
