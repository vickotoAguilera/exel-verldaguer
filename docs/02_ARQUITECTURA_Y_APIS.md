# ARQUITECTURA Y APIs

## Estructura de Proyecto (Propuesta)
- `/src/components`: UI Components (Botones, Tablas, Modales)
- `/src/lib`: Funciones utilitarias para procesamiento de Excel (Lectura, Filtrado, Exportación)
- `/src/app`: Rutas de Next.js
- `/src/store` (opcional): Manejo de estado del inventario si es complejo, o uso de Context API.

## Librerías Externas
- `xlsx`: Para manipulación de archivos Excel (lectura y generación).
- `lucide-react`: Para iconosUI.
- `clsx` + `tailwind-merge`: Para clases dinámicas de Tailwind.
