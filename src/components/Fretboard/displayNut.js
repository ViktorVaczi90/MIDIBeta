// Displays nut
import React from 'react'
const displayNut =({horizontalShift, fretWidth, verticalShift, fretsColor, fullScale, ratio})  => {
    return <rect x={horizontalShift - fretWidth - 35 / 2} y={verticalShift} width="35"
                 height={(fullScale / ratio)}
                 fill={fretsColor}/>;
}
export default displayNut
