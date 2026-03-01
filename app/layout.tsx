import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ONYX Bodega',
  description: 'MVP de inventario y pronóstico para pymes en Chile'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  );
}
