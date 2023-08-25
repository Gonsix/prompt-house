// "use client"
import './globals.css'
import type { Metadata } from 'next'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThirdwebProvider } from '@/components/ThirdwebProvider';
import {Sepolia} from "@thirdweb-dev/chains";



export const metadata: Metadata = {
  title: '🪄 PromptHouse',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">      
      <body className="center">
        <main>    
          <ThirdwebProvider activeChain={Sepolia}>
            <div className='mb-12'>
              <Header/>
            </div>

            {children}
            <div className='mt-4'>
              <Footer/>
            </div>
          </ThirdwebProvider>
        </main>
      </body>
    </html>
  )
}