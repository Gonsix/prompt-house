import React from 'react';
import ReactStars from 'react-stars';


export default function StarsComponent({ratingChange,  stars}:{ratingChange: any, stars: number})
{  
    
    return(
        <div>
            <ReactStars
            value={stars}
            count={5}
            size={24}
            half={false}
            onChange={ratingChange}
            color2={'#ffd700'} />
        </div>
    );
}
