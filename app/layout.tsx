import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clash Composer',
  description: '为 Clash 订阅添加额外规则',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-cn'>
      <body>
        {children}
      </body>
    </html>
  );
}
