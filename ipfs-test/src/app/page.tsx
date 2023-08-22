import Image from 'next/image'

import Head from 'next/head';
import Upload from '../components/Upload';


export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
    <Head>
      <title>IPFS File Uploader</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <h1 className="text-2xl text-center font-semibold mb-4">
        IPFS File Uploader using NextJS, Tailwind CSS, and NFT.storage
      </h1>
      <Upload />
    </main>

    
  </div>
  )
}
