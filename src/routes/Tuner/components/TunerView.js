import React from 'react'
import './TunerView.scss'
import RaisedButton from 'material-ui/RaisedButton';

export const Tuner = () => {
    let tunerOutline = () => {
        return <rect x="0" y="0" width={300} height={200} stroke="black" fill="white" rx={10} ry={10} />
    };
    let text = () => {
        return <text x="50" y="50" fontFamily="Verdana" fontSize="35" >
            Note
        </text>
    };
    let frequencyZero = () => {
        let noteList = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
        /* The basic formula for the frequencies of the notes of the equal tempered scale is given by
         fn = f0 * (a)n
         where
         f0 = the frequency of one fixed note which must be defined. A common choice is setting the A above middle C (A4) at f0 = 440 Hz.
         n = the number of half steps away from the fixed note you are. If you are at a higher note, n is positive.
         If you are on a lower note, n is negative.
         fn = the frequency of the note n half steps away.
         a = (2)1/12 = the twelth root of 2 = the number which when multiplied by itself 12 times equals 2 = 1.059463094359...*/
        let frequency = 440;
        let f0 = 440;
        let fN = frequency
        let a = Math.pow(2, (1 / 12));
        let n = Math.log10((fN / f0)) / Math.log10(a);

        console.log(n)

    };

    return <div>
        <svg width={500} height={500} >
            {tunerOutline()}
            {text()}
            {frequencyZero()}
        </svg>
        <RaisedButton label={'asdasd'}  primary={true}/>
    </div>

};
export default Tuner