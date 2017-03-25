// Displays blank fretboard without frets or strings
import React from 'react'
const fretboardBackground = ({horizontalShift, verticalShift, fullScale, ratio, numberOfFrets, fretBoardColor}) => {
    let blankFretboard = () => {
        return <rect x={horizontalShift} y={verticalShift}
                     width={fullScale - fullScale / Math.pow(2, numberOfFrets / ratio)}
                     height={fullScale / ratio}
                     fill={fretBoardColor}/>
    };
    return blankFretboard()
};
export default fretboardBackground