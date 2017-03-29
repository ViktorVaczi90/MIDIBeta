import React from 'react'
import './TunerView.scss'

export const Tuner = () => {
    /*let tunnerOutline = () => {
        return <rect x="0" y="0" width={300} height={100} stroke="black" fill="white" rx={10} ry={10}/>
    };*/
    let text = () => {
        return <text x="50" y="50" fontSize="35">
            Note is: {listOfNotesFreqs()}

        </text>
    };
    let listOfNotesFreqs = () => {
        /* The basic formula for the frequencies of the notes of the equal tempered scale is given by
         fn = f0 * (a)n
         where
         f0 = the frequency of one fixed note which must be defined. A common choice is setting the A above middle C (A4) at f0 = 440 Hz.
         n = the number of half steps away from the fixed note you are. If you are at a higher note, n is positive.
         If you are on a lower note, n is negative.
         fn = the frequency of the note n half steps away.
         a = (2)1/12 = the twelth root of 2 = the number which when multiplied by itself 12 times equals 2 = 1.059463094359...*/
        let noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        noteList = noteList.concat(noteList, noteList, noteList, noteList); // 4 octve long [C2 - B6]
        let noteIndex = 1;
        noteList = noteList.map((item, index) => {
            if (index % 12 == 0) {
                noteIndex++;
            }
            noteList = item + noteIndex;
            return noteList
        });
        let fx = 440;  //input frequency 80 - 400 [Hz]
        let f0 = 440;
        let a = Math.pow(2, (1 / 12));
        let fN = [];
        for (let n = -((Math.floor(noteList.length / 12) / 2) * 12 + 3); n <= (noteList.length - ((Math.floor(noteList.length / 12) / 2) * 12 + 4)); n++) {
            fN.push(f0 * Math.pow(a, n)); // fN [65.40639132514963 - 1975.533205024497] [Hz]
        }
        let res = fN.map((item, index)=> {
            if (item == fx) {
                console.log(noteList[index])
            } else if (fx > item && fx < (fN[index + 1])) {
                console.log(noteList[index])
            }
            return noteList[index]
        });
        return res
    };
    return <svg> width={1000} height={1000}>
        {text()}
    </svg>
};
export default Tuner