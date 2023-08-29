import React from "react";
import { useContext } from "react";
import { SPTContext } from "@/components/ItemDetails/ItemDetailPage";

const PromptInputForm = ({prompt}:{prompt:string}) => {
  return (
    <div>
      {/* <select value={prompt} onChange={handleChange} className="text-white font-mono bg-pbr-purple p-2 rounded-lg🧙🏻">
        <option value="Stable Diffution">Stable Diffution</option>
        <option value="DA
        LL・E">DALL・E</option>
        <option value="Midjourney">Midjourney</option>
      </select> */}
      <input 
      type="text" 
      disabled
      value = {prompt ? prompt : "Loading data..."}
      className="w-full text-white bg-pbr-purple p-2 rounded-lg"
      ></input>
      
    </div>
  );
}
  
  export default PromptInputForm;
