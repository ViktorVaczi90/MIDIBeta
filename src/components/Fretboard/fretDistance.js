// Define: the distance of the frets
import React from 'react'
const fretDistance = ({numberOfFrets, horizontalShift, fullScale, ratio, verticalShift, fretWidth, fretsColor}) => {
    let frets = Array.from(new Array(numberOfFrets)).map((item, index) => {
        return <rect key={index} x={horizontalShift + (fullScale - fullScale / Math.pow(2, index / ratio))}
                     y={verticalShift}
                     width={fretWidth}
                     height={fullScale / ratio}
                     fill={fretsColor}/>
    });
    return frets
};
export default fretDistance;