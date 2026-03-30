import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SportFund Luxembourg',
  description: 'Financement participatif pour les sportifs luxembourgeois',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
