import { Inter } from 'next/font/google'
import './globals.css'
import { headers, cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Solang',
  description: 'API Key Management Dashboard',
}

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });

  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
