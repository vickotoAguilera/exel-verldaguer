'use client';

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { LiquidSlideButton } from '@/components/ui/LiquidSlideButton';
import { useInventoryStore } from '@/store/inventoryStore';
import ExcelJS from 'exceljs';

export function ExcelUploader() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const setItems = useInventoryStore((state) => state.setItems);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            const worksheet = workbook.worksheets[0];

            const rows: any[] = [];
            const headers: string[] = [];

            worksheet.eachRow((row, rowNumber) => {
                const rowValues = row.values as any[];

                if (rowNumber === 1) {
                    rowValues.forEach((val, index) => {
                        if (index > 0 && val !== undefined && val !== null) {
                            const headerStr = typeof val === 'object' && val.richText ? val.richText.map((rt: any) => rt.text).join('') : val.toString();
                            headers[index] = headerStr.trim();
                        }
                    });
                } else {
                    const item: any = { id: crypto.randomUUID() };
                    let hasData = false;
                    rowValues.forEach((val, index) => {
                        if (index > 0 && headers[index]) {
                            item[headers[index]] = typeof val === 'object' && val !== null && val.richText
                                ? val.richText.map((rt: any) => rt.text).join('')
                                : (val instanceof Date ? val.toLocaleDateString() : val);

                            if (val !== undefined && val !== null) hasData = true;
                        }
                    });
                    if (hasData) {
                        rows.push(item);
                    }
                }
            });

            const validHeaders = headers.filter(Boolean);
            setItems(rows, validHeaders);
        } catch (err) {
            console.error(err);
            alert("Error al procesar el archivo Excel. Asegúrate de que sea válido.");
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx" onChange={handleFileUpload} />
            <LiquidSlideButton
                variant="primary"
                className="py-3 px-8 text-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
            >
                <Upload className="w-5 h-5 mr-2 inline-block" />
                <span>{loading ? "Procesando Excel..." : "Cargar Archivo Excel"}</span>
            </LiquidSlideButton>
        </>
    );
}
