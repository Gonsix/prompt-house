import React from "react";
import { useContext } from "react";
import { SPTContext } from "@/components/SellPage";

const PromptInputForm = () => {
  const { prompt , setPrompt} =  useContext(SPTContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  }

  return (
    <div>
      {/* <select value={prompt} onChange={handleChange} className="text-white font-mono bg-pbr-purple p-2 rounded-lg🧙🏻">
        <option value="Stable Diffution">Stable Diffution</option>
        <option value="DALL・E">DALL・E</option>
        <option value="Midjourney">Midjourney</option>
      </select> */}
      <input 
      type="text" 
      onChange={handleChange} className="w-full text-white bg-pbr-purple p-2 rounded-lg"
      placeholder="Your prompt   🪄✨✨✨🌟"
      ></input>
    </div>
  );
}
  
  export default PromptInputForm;
