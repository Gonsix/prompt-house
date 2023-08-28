import React from "react";

const ResizableDescriptionForm = ({description}: {description:string}) =>{

    return (
        <div className="flex">
            <textarea
                disabled
                value={description ? description : "Loading data..."}
                className="w-full h-18 p-2 border rounded bg-pbr-purple text-left prompt-description draggable ng-pristine ng-valid ng-touched"
                placeholder="Type description"
            ></textarea>
   
        </div>
    )
}

export default ResizableDescriptionForm;
