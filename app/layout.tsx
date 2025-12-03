import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conversor de Números",
  description: "Conversor entre binario, decimal y hexadecimal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
