import React from 'react';
import ReactStars from 'react-stars';


export default function StarsComponent({isOngoing, ratingChange, numSales, sumRate}:{isOngoing: boolean, ratingChange: any, numSales: number, sumRate: number})

{  
    return(
        <div>

            <div className='flex flex-row'>
                <div className='flex'>
                    <ReactStars
                    value={numSales==0 ? 0 : sumRate/numSales}
                    count={5}
                    size={24}
                    half={false}
                    edit={false}
                    color2={'#ffd700'} />
                </div>
                <div className=' text-lg align-middle mt-1.5 ml-1'>
                    ({numSales})
                </div>
            </div>
            <div hidden={!isOngoing}>
                <ReactStars
                value={1}
                count={5}
                size={24}
                half={false}
                onChange={ratingChange}
                
                color2={'#ffd700'} />
            </div>

        </div>
    );
}
