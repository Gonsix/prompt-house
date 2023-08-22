// "use client"
import { ThirdwebProvider } from '@/components/ThirdwebProvider';
import HomePage from '@/components/HomePage';
import {Sepolia} from "@thirdweb-dev/chains";

export default function Home() {
  return (
    <div>
      <ThirdwebProvider activeChain={Sepolia}>
        <HomePage/>
      </ThirdwebProvider>
    </div>
  )
}
