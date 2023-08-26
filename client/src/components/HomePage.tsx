"use client"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import HomePageTopRight from './HomePageTopRight'
import HomePageDown from './HomePageDown'

export default function HomePage() {
    
    return (
        <div className=" flex flex-col">
            {/* 上部の領域 (全体の60%) */}
            <div className="flex flex-row flex-grow h-1/2 space-x-12">
                {/* 左側の領域 */}
                <div className="w-1/2 space-y-8 ">
                    <span className="text-6xl font-bold mb-8 space-y-2 bg-gradient-to-r from-red-300 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
                        <span>Blockchain-based</span>
                        <br/>
                        <span>Prompt MarketPlace</span>
                    </span>
                    <div className="mb-8">
                        <span className="text-4xl ">
                            DALL・E, Midjourney, Stable Diffusion 🪄
                        </span>
                    </div>

                    <div className="flex flex-row space-x-2 mt-6">
                        <Link href="/sell">
                        <button type="button" className=" text-white text-xl w-48 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2"> Sell a Prompt </button>
                        </Link>

                        <Link href="/owned">
                        <button type="button" className="text-gray-900 text-xl w-48 h-12 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2">Owned Prompt</button>
                        </Link>
                    </div>
                </div>
                {/* 右側の領域 */}
                <div className="w-1/3">
                    <HomePageTopRight/>
                </div>
            </div>
            
            {/* 下部の領域 (全体の40%) */}
            <div className="flex-grow h-1/2">
                <HomePageDown/>
            </div>
        </div>
        )
    }
    
    // <p
    // className="bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
    // Gradient text
    // </p>
    