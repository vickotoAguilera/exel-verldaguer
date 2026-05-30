import ExcelJS from 'exceljs';
import { InventoryItem } from '@/store/inventoryStore';

function getCategoryColor(category?: string | null) {
    switch (category) {
        case 'baja': return 'FFFFCCCC'; // Red/Pink
        case 'cambio_sala': return 'FFFFFFCC'; // Yellow
        case 'nueva_lista': return 'FFCCFFCC'; // Green
        default: return undefined;
    }
}

const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
};

function addPaddingToWorksheet(worksheet: ExcelJS.Worksheet, originalHeaders: string[], extraCols: number) {
    const extendedHeaders = [...originalHeaders, ...Array(extraCols).fill('')];

    const headerRow = worksheet.addRow(extendedHeaders);
    headerRow.font = { bold: true };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } };
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = borderStyle;
    });

    return extendedHeaders.length;
}

function addEmptyBottomRows(worksheet: ExcelJS.Worksheet, totalColumns: number, extraRows: number) {
    for (let i = 0; i < extraRows; i++) {
        const emptyRow = worksheet.addRow(Array(totalColumns).fill(''));
        emptyRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = borderStyle;
        });
    }
}

export async function exportUnified(items: InventoryItem[], originalHeaders: string[], extraCols: number = 0, extraRows: number = 0) {
    const categorizedItems = items.filter(i => i._category);

    if (categorizedItems.length === 0) {
        alert('No has categorizado ningún ítem todavía. Selecciona elementos y asígnalos a una categoría primero.');
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventario Unificado');
    const totalColumns = addPaddingToWorksheet(worksheet, originalHeaders, extraCols);

    categorizedItems.forEach((item) => {
        const rowValues = [...originalHeaders.map(h => item[h] || ''), ...Array(extraCols).fill('')];
        const row = worksheet.addRow(rowValues);

        const fgColor = getCategoryColor(item._category);
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = borderStyle;
            if (fgColor) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColor } };
            }
        });
    });

    addEmptyBottomRows(worksheet, totalColumns, extraRows);
    await saveToFile(workbook, 'Inventario_Unificado.xlsx');
}

export async function exportSeparated(items: InventoryItem[], originalHeaders: string[], extraCols: number = 0, extraRows: number = 0) {
    const lists: Record<string, InventoryItem[]> = {};

    const bajaItems = items.filter(i => i._category === 'baja');
    if (bajaItems.length > 0) lists['Baja'] = bajaItems;

    const cambioItems = items.filter(i => i._category === 'cambio_sala');
    if (cambioItems.length > 0) lists['Cambio_Sala'] = cambioItems;

    items.filter(i => i._category === 'nueva_lista').forEach(item => {
        const name = item._listName || 'Nueva_Lista';
        if (!lists[name]) lists[name] = [];
        lists[name].push(item);
    });

    const entries = Object.entries(lists);

    if (entries.length === 0) {
        alert('No has categorizado ningún ítem todavía. Selecciona elementos y asígnalos a una categoría primero.');
        return;
    }

    for (const [listName, listItems] of entries) {
        const workbook = new ExcelJS.Workbook();
        const safeName = listName.substring(0, 31).replace(/[\\/*?:\[\]]/g, '');
        const worksheet = workbook.addWorksheet(safeName);

        const totalColumns = addPaddingToWorksheet(worksheet, originalHeaders, extraCols);

        listItems.forEach((item) => {
            const rowValues = [...originalHeaders.map(h => item[h] || ''), ...Array(extraCols).fill('')];
            const row = worksheet.addRow(rowValues);
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = borderStyle;
            });
        });

        addEmptyBottomRows(worksheet, totalColumns, extraRows);
        await saveToFile(workbook, `${safeName}.xlsx`);
    }
}

async function saveToFile(workbook: ExcelJS.Workbook, filename: string) {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, 100);
}
