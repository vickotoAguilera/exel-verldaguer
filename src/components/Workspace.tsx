'use client';

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { ExcelUploader } from './ExcelUploader';
import { LiquidSlideButton } from './ui/LiquidSlideButton';
import { exportSeparated, exportUnified } from '@/lib/excelExport';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;

export function Workspace() {
    const { items, originalHeaders } = useInventoryStore();
    const updateCategory = useInventoryStore(state => state.updateCategory);

    const [activeMode, setActiveMode] = useState<'baja' | 'cambio_sala' | 'nueva_lista' | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [newListName, setNewListName] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);

    // Layout state 
    const [extraRows, setExtraRows] = useState<number>(0);
    const [extraCols, setExtraCols] = useState<number>(0);

    // Column widths state (px). Initialised lazily per header.
    const [colWidths, setColWidths] = useState<Record<string, number>>({});
    const resizingRef = useRef<{ col: string; startX: number; startW: number } | null>(null);

    const getColWidth = (h: string) => colWidths[h] ?? 180;

    // --- Resize handlers ---
    const onResizeStart = useCallback((e: React.MouseEvent, header: string) => {
        e.preventDefault();
        e.stopPropagation(); // don't trigger sort

        const startX = e.clientX;
        const startW = getColWidth(header);
        resizingRef.current = { col: header, startX, startW };

        const onMove = (ev: MouseEvent) => {
            if (!resizingRef.current) return;
            const { col, startX, startW } = resizingRef.current;
            const diff = ev.clientX - startX;
            const newW = Math.max(60, startW + diff);
            setColWidths(prev => ({ ...prev, [col]: newW }));
        };

        const onUp = () => {
            resizingRef.current = null;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, [colWidths]);

    const availableItems = items.filter(i => !i._category);

    // --- Sorting logic (must be before any early return) ---
    const sortedItems = useMemo(() => {
        if (!sortColumn || !sortDir) return availableItems;
        return [...availableItems].sort((a, b) => {
            const valA = a[sortColumn] ?? '';
            const valB = b[sortColumn] ?? '';
            const numA = Number(valA);
            const numB = Number(valB);
            if (!isNaN(numA) && !isNaN(numB)) {
                return sortDir === 'asc' ? numA - numB : numB - numA;
            }
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            if (strA < strB) return sortDir === 'asc' ? -1 : 1;
            if (strA > strB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [availableItems, sortColumn, sortDir]);

    if (items.length === 0) {
        return (
            <div className="bg-[#0f0f13] border border-white/5 rounded-3xl p-10 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <h2 className="text-3xl font-bold mb-4 text-white">Sube tu Excel Maestro</h2>
                <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Carga tu memoria de inventario para comenzar.</p>
                <ExcelUploader />
            </div>
        );
    }

    const handleSort = (header: string) => {
        if (sortColumn === header) {
            if (sortDir === 'asc') setSortDir('desc');
            else if (sortDir === 'desc') { setSortColumn(null); setSortDir(null); }
        } else {
            setSortColumn(header);
            setSortDir('asc');
        }
    };

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleSave = () => {
        if (!activeMode) { alert('Primero selecciona una acción: Dar de Baja, Cambio de Sala o Nueva Lista.'); return; }
        if (selectedIds.size === 0) { alert('Selecciona al menos un ítem de la tabla.'); return; }
        if (activeMode === 'nueva_lista' && !newListName.trim()) { alert('Debes ingresar un nombre para la nueva lista.'); return; }
        updateCategory(Array.from(selectedIds), activeMode, newListName);
        setActiveMode(null);
        setSelectedIds(new Set());
        setNewListName('');
    };

    const cancelSelection = () => { setActiveMode(null); setSelectedIds(new Set()); setNewListName(''); };

    const SortIcon = ({ header }: { header: string }) => {
        if (sortColumn !== header) return <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 ml-1.5 inline-block" />;
        if (sortDir === 'asc') return <ArrowUp className="w-3.5 h-3.5 text-indigo-400 ml-1.5 inline-block" />;
        return <ArrowDown className="w-3.5 h-3.5 text-indigo-400 ml-1.5 inline-block" />;
    };

    // Total table width = checkbox col + all header cols
    const totalWidth = 48 + originalHeaders.reduce((sum, h) => sum + getColWidth(h), 0);

    return (
        <div className="bg-[#0f0f13] border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            {/* Action Bar */}
            <div className="flex flex-wrap gap-4 mb-6">
                <LiquidSlideButton variant="danger" onClick={() => setActiveMode('baja')} disabled={activeMode !== null}>Dar de Baja</LiquidSlideButton>
                <LiquidSlideButton variant="warning" onClick={() => setActiveMode('cambio_sala')} disabled={activeMode !== null}>Cambio de Sala</LiquidSlideButton>
                <LiquidSlideButton variant="success" onClick={() => setActiveMode('nueva_lista')} disabled={activeMode !== null}>Nueva Lista</LiquidSlideButton>
                <div className="flex-1" />

                {/* Padding controls */}
                <div className="flex items-center gap-3 bg-white/5 px-4 rounded-full border border-white/10 hidden lg:flex" title="Cajas en blanco extra (Bordes vacíos) al exportar">
                    <span className="text-zinc-400 text-sm whitespace-nowrap">Añadir vacías:</span>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-xs">Cols</span>
                        <input type="number" min="0" max="50" value={extraCols} onChange={e => setExtraCols(Number(e.target.value) || 0)}
                            className="w-14 bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-xs">Filas</span>
                        <input type="number" min="0" max="500" value={extraRows} onChange={e => setExtraRows(Number(e.target.value) || 0)}
                            className="w-16 bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-sm" />
                    </div>
                </div>

                <LiquidSlideButton variant="outline" onClick={() => exportSeparated(items, originalHeaders, extraCols, extraRows)}>Exportar Separados</LiquidSlideButton>
                <LiquidSlideButton variant="primary" onClick={() => exportUnified(items, originalHeaders, extraCols, extraRows)}>Exportar Unificado</LiquidSlideButton>
            </div>

            {/* Mode banner */}
            {activeMode !== null && (
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-lg font-medium text-white">Modo: {activeMode.replace('_', ' ').toUpperCase()}</span>
                        {activeMode === 'nueva_lista' && (
                            <input type="text" placeholder="Nombre de la nueva lista..." value={newListName} onChange={e => setNewListName(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors w-64" />
                        )}
                        <span className="text-zinc-400 font-medium px-4 py-1.5 bg-black/30 rounded-lg">Seleccionados: {selectedIds.size}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={cancelSelection} className="text-zinc-400 hover:text-white px-4 py-2 transition-colors">Cancelar</button>
                        <LiquidSlideButton variant="primary" onClick={handleSave} className="py-2 px-6">Confirmar {selectedIds.size} ítems</LiquidSlideButton>
                    </div>
                </div>
            )}

            {/* Hint */}
            {activeMode === null && selectedIds.size > 0 && (
                <div className="mb-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-between">
                    <span className="text-zinc-300">{selectedIds.size} ítem(s) seleccionados — Elige una acción arriba para continuar.</span>
                    <button onClick={() => setSelectedIds(new Set())} className="text-zinc-400 hover:text-white px-4 py-2 transition-colors text-sm">Limpiar selección</button>
                </div>
            )}

            {/* Spreadsheet-style Table */}
            <div className="overflow-auto rounded-xl border border-white/5 bg-black/20" style={{ maxHeight: '70vh' }}>
                <table className="text-left text-sm text-zinc-300 border-collapse" style={{ minWidth: '100%', width: totalWidth }}>
                    <thead className="bg-[#1a1a24] text-white/80 border-b border-white/5 sticky top-0 z-10">
                        <tr>
                            <th className="px-3 py-3 w-12 font-medium border-r border-white/10 text-center">✓</th>
                            {originalHeaders.map((h, i) => (
                                <th
                                    key={i}
                                    className="relative px-3 py-3 font-medium select-none border-r border-white/10 group bg-[#1a1a24]"
                                    style={{ width: getColWidth(h), minWidth: 60 }}
                                >
                                    <div className="flex items-center cursor-pointer hover:text-indigo-300 transition-colors" onClick={() => handleSort(h)}>
                                        <span className="truncate flex-1">{h}</span>
                                        <SortIcon header={h} />
                                    </div>
                                    {/* Resize handle */}
                                    <div
                                        onMouseDown={(e) => onResizeStart(e, h)}
                                        className="absolute right-0 top-0 bottom-0 w-[5px] cursor-col-resize group-hover:bg-indigo-500/40 hover:!bg-indigo-500/70 transition-colors z-20"
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => toggleSelection(row.id)}
                                className={`border-b border-white/5 transition-colors cursor-pointer hover:bg-white/5 ${selectedIds.has(row.id) ? 'bg-indigo-500/20 hover:bg-indigo-500/30' : ''
                                    }`}
                            >
                                <td className="px-3 py-2.5 border-r border-white/10 text-center">
                                    <input type="checkbox" checked={selectedIds.has(row.id)} readOnly className="w-4 h-4 rounded accent-indigo-500 pointer-events-none" />
                                </td>
                                {originalHeaders.map((h, i) => (
                                    <td key={i} className="px-3 py-2.5 border-r border-white/10 truncate" style={{ width: getColWidth(h), maxWidth: getColWidth(h) }}>
                                        {row[h]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {sortedItems.length === 0 && (
                            <tr>
                                <td colSpan={originalHeaders.length + 1} className="px-4 py-16 text-center text-zinc-500 text-base">No hay más ítems disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
