# YearBloom

YearBloom es un diario-jardín anual instalable en iPhone como PWA. La versión publicada es totalmente gratuita para uso personal y funciona directamente desde archivos estáticos en la raíz del repositorio, sin depender de npm ni de un backend.

## Versión publicada

`index.html`, `styles.css`, `app.js`, `manifest.webmanifest` y `sw.js` forman la PWA de producción. GitHub Pages puede servirla directamente desde `main`.

Incluye jardín de 365 días, plantas originales por fecha, emoción 1–5, texto libre, hasta cinco fotos comprimidas por día, recuerdos con búsqueda, estadísticas, funcionamiento offline y copias JSON.

Los datos se almacenan localmente mediante IndexedDB. Conviene exportar una copia periódicamente porque borrar los datos de Safari también puede borrar el diario local.

## Instalar en iPhone

Abre `https://angriogon.github.io/YearBloom/` en Safari, toca Compartir y elige **Añadir a pantalla de inicio**.

## Código de desarrollo

El prototipo React/Vite se conserva en `src/` y se abre con `app.html`:

```bash
npm install
npm run dev
```

La aplicación publicada no depende de ese build.

## Nota legal

YearBloom es una implementación original e independiente inspirada en el concepto de diario visual anual. No copia marca, ilustraciones, capturas, textos ni código de terceros.
