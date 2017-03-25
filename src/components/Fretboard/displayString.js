// Displays the strings according to stringNumber
import React from 'react'
const displayString = ({stringNumber, horizontalShift, fretWidth, verticalShift, fullScale, ratio, numberOfFrets, stringColor}) => {
    let strings = Array.from(new Array(stringNumber)).map((item, index) => {

        return <rect key={index} x={horizontalShift + fretWidth}
                     y={verticalShift + (((fullScale / ratio) / (stringNumber)) / 2 + ((fullScale / ratio) / stringNumber) * index)}
                     width={fullScale - fullScale / Math.pow(2, numberOfFrets / ratio)} height={3 + index}
                     fill={stringColor}/>
    });
    return strings
};
export default displayString;