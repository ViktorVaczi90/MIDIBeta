import React from 'react'
import './Fretboard.scss'
import { connect } from 'react-redux'
import displayNote from './displayNote.js'
import displayNut from './displayNut.js'
import fretDistance from './fretDistance.js'
import displayString from './displayString.js'
import displayMarkPoints from './displayMarkPoints.js'
import fretboardBackground from './fretboardBackground.js'

const mapNoteToFretboard = (note, position, color, stringStarts = [64, 59, 55, 50, 45, 40]) => {
    let good = stringStarts
        .map(i=>note.midi - i)
        .map(i=>[{fretPosition: i}])
        .map(i=>i.filter(obj=>obj.fretPosition >= 0));
    let bestFit = good.reduce((acc, curr)=> {
        if (!curr.length) {
            return acc
        }
        if (curr[0].fretPosition - position >= 0 && curr[0].fretPosition - position < acc) return curr[0].fretPosition - position;
        return acc
    }, 999);
    let ready = good
        .map((i, stringIndex)=>
            i.filter(item => item.fretPosition - position === bestFit)
                .map(item => ({fretNum: note.midi - stringStarts[stringIndex], color, text: note.name})));
    return ready
};

export const Fretboard = ({currentNote, notes}) => {
    let stringNumber = 6;
    let numberOfFrets = 16;
    let ratio = 15;
    let fullScale = 2500;
    let fretWidth = ratio / 2.5;
    let markPoint = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    let fretBoardColor = "#fee4b4";
    let pointSize = ratio / 2;
    let markPointColor = "back"
    let textSize = 20;
    let stringColor = "#DAA520";
    let fretsColor = "#C0C0C0";
    let textCorrection = 5;
    let fretHeightCorrection = 4;
    let fretData = mapNoteToFretboard(currentNote, 5, "green");
    //let fretData = []
    let horizontalShift = 400;
    let verticalShift = 200;
    return <svg width={fullScale} height={verticalShift + (fullScale / ratio) + verticalShift}>
        {fretboardBackground({horizontalShift, verticalShift, fullScale, ratio, numberOfFrets, fretBoardColor})}
        {displayNut({horizontalShift, fretWidth, verticalShift, fretsColor, fullScale, ratio})}
        {fretDistance({numberOfFrets, horizontalShift, fullScale, ratio, verticalShift, fretWidth, fretsColor})}
        {displayMarkPoints({
            numberOfFrets,
            horizontalShift,
            verticalShift,
            fretWidth,
            fullScale,
            ratio,
            markPointColor,
            pointSize,
            markPoint
        })}
        {displayString({
            stringNumber,
            horizontalShift,
            fretWidth,
            verticalShift,
            fullScale,
            ratio,
            numberOfFrets,
            stringColor
        })}
        {displayNote({
            fretData, fullScale, ratio, stringNumber, horizontalShift, verticalShift,
            fretHeightCorrection, textSize, fretWidth, textCorrection
        })}
    </svg>
};

const mapStateToProps = (state, ownProps) => {
    return {
        currentNote: state.currentNote
    }
};

const mapDispatchToProps = (dispatch) =>
    ( {
        changeNote: (note) => {
            dispatch(changeCurrentNote(note))
        }
    });
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Fretboard)