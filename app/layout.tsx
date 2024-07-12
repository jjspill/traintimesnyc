import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MTA Train Times NYC - Live Subway Updates',
  description:
    'Get live MTA train times for all New York City subway stations. Check real-time arrivals and departures to plan your NYC commute efficiently. Click to see the latest updates!',
  keywords:
    'NYC MTA train times, live subway times NYC, real-time train schedule NYC, New York subway stations, NYC train routes',
  openGraph: {
    title: 'Live MTA Train Times in NYC - Instant Subway Updates',
    type: 'website',
    url: 'https://traintimesnyc.com',
    siteName: 'Train Times NYC',
    description:
      'Access up-to-the-minute MTA train times for New York City. Plan your commute with live subway updates directly on your phone or desktop!',
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
