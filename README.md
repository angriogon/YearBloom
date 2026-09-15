# YearBloom

YearBloom es una web app instalable para iPhone (PWA) pensada como diario visual de un año completo. Está diseñada para uso personal, totalmente gratuita en esta versión, y ofrece una experiencia cuidada inspirada en el concepto de jardín diario sin reutilizar marca, código ni recursos gráficos de terceros.

## Qué incluye

- Jardín anual de 365 días.
- Planta original generada para cada fecha.
- Registro diario del estado de ánimo.
- Recuerdo en texto libre.
- Hasta 5 fotos por día.
- Búsqueda y filtros en recuerdos.
- Resumen visual del año.
- Almacenamiento local sin cuenta.
- Exportación e importación en JSON.
- Funcionamiento offline una vez instalada/cargada.
- Sincronización opcional con Supabase.
- Preparada para GitHub Pages.

## Modo de uso personal gratuito

La app queda desbloqueada para uso personal. No hay muro de pago dentro de esta versión.

## Desarrollo local

```bash
npm install
npm run dev
```

## Publicación en GitHub Pages

El repositorio incluye workflow en `.github/workflows/deploy-pages.yml`.

1. En GitHub entra en **Settings → Pages**.
2. Selecciona **GitHub Actions** como fuente.
3. El workflow compila `dist` y lo publica automáticamente.

Después, en iPhone:

1. Abre la URL publicada en Safari.
2. Pulsa **Compartir**.
3. Elige **Añadir a pantalla de inicio**.
4. Abre YearBloom desde el icono como si fuera una app.

## Sincronización opcional

Si quieres sincronizar varios dispositivos:

1. Crea un proyecto gratuito en Supabase.
2. Ejecuta `supabase/schema.sql` en el SQL Editor.
3. Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` a `.env`.
4. Activa Email / Magic Link en Supabase Auth.

## Nota legal

YearBloom es una implementación original e independiente. Reproduce una experiencia funcional similar a la de un diario visual anual, pero no copia ilustraciones, marca, capturas, textos ni otros recursos protegidos de terceros.
