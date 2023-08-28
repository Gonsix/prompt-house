import React from "react";
import { useContext } from "react";
import { SPTContext } from "@/components/ItemDetails/ItemDetailPage";




const BuyResizableParametersForm = ({params}:{params:string}) =>{

    return (
        <div className="flex">
            {/* <input 
                type="text" 
                value={description} 
                onChange={handleInputChange} 
                className={`w-full h-64 p-2 border rounded bg-pbr-purple text-left `}
            /> */}
            <textarea
                disabled
                value={params ? params : "Loading data..."}
                className="w-full h-36 p-2 border rounded bg-pbr-purple text-left prompt-description draggable ng-pristine ng-valid ng-touched"
                placeholder='(e.g) 
                {
                    seed : "23471234243"...
                }'
            ></textarea>
   
        </div>
    )
}

export default BuyResizableParametersForm;
