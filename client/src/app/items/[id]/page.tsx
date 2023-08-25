"use client"
import ItemPage from "@/components/ItemPage";


function Page({params}: {params: {id : string}}) {


    return (
        <div>
            <ItemPage id={params.id}/>
        </div>
    );
}

export default Page;
