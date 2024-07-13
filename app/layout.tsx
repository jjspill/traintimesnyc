import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Train Times NYC - Live Subway Updates',
  description:
    'Discover real-time MTA train arrival times for subway stations nearest to you.',
  keywords:
    'train times, MTA, nyc trains, subway, subway near me, NYC MTA train times, live subway times NYC, real-time train schedule NYC, New York subway stations, NYC train routes',
  openGraph: {
    title: 'Train Times NYC - Live Subway Updates',
    type: 'website',
    url: 'https://traintimesnyc.com',
    siteName: 'Train Times NYC',
    description:
      'Discover real-time MTA train arrival times for subway stations nearest to you.',
  },
  metadataBase: new URL('https://traintimesnyc.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
