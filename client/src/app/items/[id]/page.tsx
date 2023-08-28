"use client"
import ItemDetailPage from "@/components/ItemDetails/ItemDetailPage";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <>
      <ItemDetailPage id={id}/>
    </>
  )
}
