import { create } from 'zustand';

export interface InventoryItem {
    id: string;
    [key: string]: any;
    _category?: 'baja' | 'cambio_sala' | 'nueva_lista' | null;
    _listName?: string;
}

interface InventoryState {
    originalHeaders: string[];
    items: InventoryItem[];
    setItems: (items: InventoryItem[], headers: string[]) => void;
    updateCategory: (id: string | string[], category: InventoryItem['_category'], listName?: string) => void;
    reset: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
    originalHeaders: [],
    items: [],
    setItems: (items, originalHeaders) => set({ items, originalHeaders }),
    updateCategory: (idOrIds, category, listName) => set((state) => {
        const idsToUpdate = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
        return {
            items: state.items.map(i =>
                idsToUpdate.includes(i.id) ? { ...i, _category: category, _listName: listName } : i
            )
        };
    }),
    reset: () => set({ items: [], originalHeaders: [] })
}));
