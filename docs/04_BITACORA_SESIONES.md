# BITÁCORA DE SESIONES

## [2026-05-30]
- **Hora**: 12:44
- **Acción**: Inicialización del Banco de Memoria del proyecto e inicio de planificación de arquitectura de Next.js para la aplicación de inventario Excel.
- **Hora**: 12:55
- **Acción**: Construcción de UI con Tailwind CSS y Framer Motion (Hero, Navbar, LiquidSlideButton). Implementación finalizada de sistema de subida, parsing interactivo y exportación modular unificada con `exceljs`. Test de compilación y tipado superado con éxito.
- **Hora**: 13:05
- **Acción**: Fix bug de selección — eliminé la guarda `activeMode === null` que impedía hacer click en las filas. Agregué ordenamiento por columna (click en encabezado → asc/desc/off) con iconos indicativos.
- **Hora**: 13:07
- **Acción**: Tabla ahora ocupa ancho completo del viewport. Columnas redimensionables con drag al estilo Excel (handle visible en hover, mínimo 60px). Bordes tipo grilla y contenido truncado con `truncate`.
- **Hora**: 13:28
- **Acción**: Ajuste Next.js para Cloudflare Pages (Static export configurado en `next.config.ts` y desactivación de imágenes dinámicas). Todo el código final fue subido a GitHub remotamente.
