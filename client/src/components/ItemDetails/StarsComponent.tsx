import React from 'react';
import ReactStars from 'react-stars';

export default function StarsComponent({ratingChange}:{ratingChange: any })
{  
    
    return(
        <div>
            <ReactStars
            value={1}
            count={6}
            size={24}
            half={false}
            onChange={ratingChange}
            color2={'#ffd700'} />
        </div>
    );
}