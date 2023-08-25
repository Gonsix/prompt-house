import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

// propsの型定義
interface ItemCardProps {
    src: string;
    id: string | number;
    height?: number;
    width?: number
}

const ItemCard: React.FC<ItemCardProps> = ({ src, id, height = 256, width = 256 }) => {
    return (
        <>
            <Link href={`/items/${id}`}>
                <div className='transition-transform transform hover:scale-105'>
                    <Image 
                    src={src} 
                    alt="Image" 
                    width={width} 
                    height={height} 
                    className="transition-filter hover:brightness-180 rounded-md" 
                    />
                </div>

            </Link>
        </>
    );
}

export default ItemCard;
