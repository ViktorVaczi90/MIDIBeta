// Displays the notes with the name of them on the fretboard
import React from 'react'
const displayNote = (
    {fretData, fullScale, ratio, stringNumber, horizontalShift, verticalShift, fretHeightCorrection, textSize, fretWidth, textCorrection})=> {
    let retVal = fretData.map((string, stringIndex)=> {
        return string.map(fret=> {
            let origo = {
                x: (fullScale - fullScale / Math.pow(2, (fret.fretNum - 1) / ratio) + fullScale - fullScale / Math.pow(2, fret.fretNum / ratio)) / 2,
                y: ((fullScale / ratio) / (stringNumber)) / 2 + ((fullScale / ratio)) / (stringNumber) * stringIndex
            };
            let origoBlankedString = {
                x: (30),
                y: ((fullScale / ratio) / (stringNumber)) / 2 + ((fullScale / ratio)) / (stringNumber) * stringIndex
            };
            let fretLength = {
                x: ((fullScale - fullScale / Math.pow(2, fret.fretNum / ratio)) - (fullScale - fullScale / Math.pow(2, (fret.fretNum - 1) / ratio))) - fretWidth * 2,
                y: ((fullScale / ratio) / stringNumber)
            };
            let ifOrigo = [
                <rect x={horizontalShift + (origo.x - fretLength.x / 2)}
                      y={verticalShift + (origo.y - (fretLength.y / 2))}
                      width={fretLength.x + fretWidth}
                      height={fretLength.y - fretHeightCorrection}
                      fill={fret.color}/>,
                <text x={horizontalShift + origo.x} y={verticalShift + (origo.y + textCorrection)}
                      fontSize={textSize}>{fret.text}</text>
            ];

            let ifOrigoBlankedString = [
                <rect x={horizontalShift + (origoBlankedString.x - fretLength.x / 2)}
                      y={verticalShift + (origoBlankedString.y - (fretLength.y / 2))} width="30"
                      height={fretLength.y - fretHeightCorrection}
                      fill={fret.color}/>,
                <text x={horizontalShift - textCorrection * 4}
                      y={verticalShift + (origoBlankedString.y + textCorrection)}
                      fontSize={textSize}>{fret.text}</text>
            ];
            if (fret.fretNum == 0) {
                return ifOrigoBlankedString
            } else {
                return ifOrigo
            }
        })
    })
    //console.log(retVal)
    return retVal
}

export default displayNote