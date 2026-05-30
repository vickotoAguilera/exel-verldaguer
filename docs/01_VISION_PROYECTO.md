# VISIÓN DEL PROYECTO: Sistema de Gestión de Inventario mediante Excel

## Objetivo Principal
Desarrollar una aplicación web para la gestión rápida de inventario que permita a los usuarios cargar un archivo Excel maestro, visualizar todos los ítems y organizarlos interactuando y separándolos en listas categorizadas.

## Casos de Uso Core
- Carga y visualización de un archivo Excel maestro.
- Selección interactiva de equipos/artículos de la lista.
- Categorización de ítems seleccionados en listas como:
  - Dar de baja
  - Cambio de sala
  - Creación de nueva lista personalizada
- Generación y descarga de archivos Excel separados para cada lista.
- Generación de un Excel unificado con colores de fondo por fila, indicando la categoría (Baja, Cambio, Nueva Lista, etc.), manteniendo los de origen sin color.

## Stack Tecnológico
- **Framework Core**: Next.js (Última versión estable)
- **UI & Estilos**: Tailwind CSS, CSS modular, React (Última versión estable)
- **Procesamiento de Archivos**: Librerías para XLSX parsing/generation (e.g. `xlsx` o `exceljs`).
