import "./globals.css";

export const metadata = {
  title: "Proyecto Fullstack - Neon y Vercel",
  description: "Aplicación web con Next.js y base de datos Neon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}