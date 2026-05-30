# MODELOS DE DATOS

## Modelo Principal: InventoryItem
```typescript
interface InventoryItem {
  id: string; // Puede ser generado o sacado del excel
  [key: string]: any; // Datos dinámicos del excel original
  _category?: 'baja' | 'cambio_sala' | 'nueva_lista' | null;
  _listName?: string; // Si se crea una nueva lista
}
```

## Estado de la Aplicación
- `originalData`: `InventoryItem[]` - Todos los datos leídos del Excel inicial.
- `selectedItems`: `Set<string>` - IDs seleccionados en la UI actualmente.
- `activeCategory`: string o null - Modo en el que estamos operando ("Dar de baja", "Cambio de sala").
