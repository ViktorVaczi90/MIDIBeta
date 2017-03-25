// Display the mark points on the guitar neck
import React from 'react'
const displayMarkPoints = ({numberOfFrets, horizontalShift, verticalShift, fretWidth, fullScale, ratio, markPointColor, pointSize, markPoint}) => {
    let fretBoardPoint = markPoint.map((item, index)=> {
        if (item > numberOfFrets) return undefined;
        let returnCircle;
        if (item == 12 || item == 24) {
            returnCircle = [
                <circle key={"down" + index}
                        cx={horizontalShift + (fullScale - fullScale / Math.pow(2, (item - 1) / ratio) + fullScale - fullScale / Math.pow(2, item / ratio)) / 2 + fretWidth / 2}
                        cy={verticalShift + ((fullScale / ratio / 4) * 3)} r={pointSize} fill={markPointColor}/>,

                <circle key={"up" + index}
                        cx={horizontalShift + (fullScale - fullScale / Math.pow(2, (item - 1) / ratio) + fullScale - fullScale / Math.pow(2, item / ratio)) / 2 + fretWidth / 2}
                        cy={verticalShift + ((fullScale / ratio / 4))} r={pointSize} fill={markPointColor}/>]
        } else {
            returnCircle =
                <circle key={index}
                        cx={horizontalShift + (fullScale - fullScale / Math.pow(2, (item - 1) / ratio) + fullScale - fullScale / Math.pow(2, item / 15)) / 2 + fretWidth / 2}
                        cy={verticalShift + (fullScale / ratio / 2)} r={pointSize} fill={markPointColor}/>
        }
        return returnCircle;
    });
    return fretBoardPoint
};
export default displayMarkPoints