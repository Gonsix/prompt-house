import React from "react";
import { useContext } from "react";
import { SPTContext } from "@/components/SellPage";

const ModelSelectComponent = () => {
  const { selectedModel , setSelectedModel} =  useContext(SPTContext);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  }

  return (
    <div>
      <select value={selectedModel}  onChange={handleChange} className="text-white font-mono bg-pbr-purple p-2 rounded-lg">
        <option value="Stable Diffution" selected>Stable Diffution</option>
        <option value="DALL・E">DALL・E</option>
        <option value="Midjourney">Midjourney</option>
      </select>
    </div>
  );
}
  
  export default ModelSelectComponent;
