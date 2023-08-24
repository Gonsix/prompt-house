"use client"
import Image from 'next/image';

export default function HomePageTopRight() {

  return (
    <div className="flex justify-center ">
      <Image
          src="/images/HomeImage.png"
          alt="猫は最高に可愛い"
          width={512}
          height={512}
          className="rounded-lg"
        />
    </div>
  )
}
