"use client"
import { useState, CSSProperties, useRef } from 'react';
import { NFTStorage } from 'nft.storage';
import { ipfsToHTTPS } from '@/helpers';
import Image, { StaticImageData } from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [ipfsURL, setIpfsURL] = useState<string>("");
    const [localURL, setLocalURL] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if(!file){
            return;
        }

        setUploading(true);

        const client = new NFTStorage({token : process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY as string});
        const metadata = await client.store({
            name: "First Image",
            description: "First Description",
            image: file
        });

        const uri = metadata.url;

        const metadataResponse = await fetch(ipfsToHTTPS(uri));
        if (metadataResponse.status != 200) return;
        const json = await metadataResponse.json();



                
        // const response = await fetch(url)

        // const data = await response.json();
        // console.log(data)

        const imageURL = ipfsToHTTPS(json.image);
        
        console.log(imageURL);

        setIpfsURL(imageURL);
        setUploading(false);
        // console.log(metadata);
    }

    

    const handleChange = (event: any) => {

        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        // Create an object URL for the selected file
        const objectURL = URL.createObjectURL(selectedFile);
        setLocalURL(objectURL);
      };



    return(
        <div className="max-w-lg mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="text-gray-700 font-bold mb-2" htmlFor="file">
                        Choose a file to upload
                    </label>
                    <div
                    className="relative border-dashed border-2 border-gray-400 rounded-lg h-64 flex justify-center items-center"
                    onClick={() => fileInputRef.current?.click()}>
                        <div className="absolute">
                            <div className="flex flex-col items-center">
                                <svg
                                    className="w-10 h-10 text-gray-400 group-hover:text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    ></path>    
                                </svg>
                                <span className="text-gray-400 group-hover:text-gray-600 mt-2">
                                {!file && 'Select a file'}
                                
                                </span>
                            </div>

                        </div>
                        <input
                            type="file"
                            className="h-full w-full opacity-0"
                            id="file"
                            onChange={handleChange}
                            ref={fileInputRef}
                        />
                        {localURL && !ipfsURL && (
                            <Image layout="fill" objectFit="cover" src={localURL} alt="Selected File Preview" />
                        )}
                    </div>

                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={!file || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>

            {/* {localURL && !ipfsURL && (
                <div className="mt-8">
                    <p className="ext-gray-700 font-bold">Selected File Preview:</p>
                    <Image width="500" height="500" src={localURL} alt="Selected File Preview" />
                </div>
            )} */}
            
            {ipfsURL&& (
                <div className="mt-8">
                    <p className="ext-gray-700 font-bold"> File Uploaded to IPFS:</p>
                    {/* <a 
                        href={ipfsURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700">
                        {ipfsURL}
                    </a> */}
                    <Image width="500" height="500" src={ipfsURL} alt={ipfsURL} ></Image>
                </div>
                
            )}
        </div>
    )

}

