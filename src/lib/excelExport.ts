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

export async function exportUnified(items: InventoryItem[], originalHeaders: string[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventario Unificado');

    // Headers
    worksheet.addRow(originalHeaders);
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } };

    // Data
    items.forEach((item) => {
        const rowValues = originalHeaders.map(h => item[h] || '');
        const row = worksheet.addRow(rowValues);

        const fgColor = getCategoryColor(item._category);
        if (fgColor) {
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: fgColor }
                };
            });
        }
    });

    saveToFile(workbook, 'Inventario_Unificado.xlsx');
}

export async function exportSeparated(items: InventoryItem[], originalHeaders: string[]) {
    const workbook = new ExcelJS.Workbook();

    const lists: Record<string, InventoryItem[]> = {
        'Disponibles': items.filter(i => !i._category),
        'Baja': items.filter(i => i._category === 'baja'),
        'Cambio_Sala': items.filter(i => i._category === 'cambio_sala')
    };

    // Custom lists
    items.filter(i => i._category === 'nueva_lista').forEach(item => {
        const name = item._listName || 'Nueva_Lista';
        if (!lists[name]) lists[name] = [];
        lists[name].push(item);
    });

    Object.entries(lists).forEach(([sheetName, sheetItems]) => {
        if (sheetItems.length === 0) return;

        // Excel worksheet names cannot exceed 31 chars
        const safeName = sheetName.substring(0, 31).replace(/[\\/*?:\[\]]/g, '');
        const worksheet = workbook.addWorksheet(safeName);

        worksheet.addRow(originalHeaders);
        worksheet.getRow(1).font = { bold: true };

        sheetItems.forEach((item) => {
            const rowValues = originalHeaders.map(h => item[h] || '');
            worksheet.addRow(rowValues);
        });
    });

    saveToFile(workbook, 'Inventario_Listas_Separadas.xlsx');
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
