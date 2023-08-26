"use client"
import BuyPage from "@/components/BuyPage";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <>
      <BuyPage id={id}/>
    </>
  )
}
