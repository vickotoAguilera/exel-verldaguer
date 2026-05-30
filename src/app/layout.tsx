import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CinematicGlassNavbar } from '@/components/ui/CinematicGlassNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ExcelFlow - Gestión de Inventario',
  description: 'Sistema web de gestión de inventario inteligente',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#030305] min-h-screen text-slate-200 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <CinematicGlassNavbar />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
