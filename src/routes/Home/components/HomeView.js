import React from 'react'
import MidiConvert from 'midiconvert';
import Tone from 'tone';
import { connect } from 'react-redux'
import {changeCurrentNote} from '../../../store/currentNote'
import './HomeView.scss'

const MidiWriter = require('midi-writer-js');
const synth = new Tone.Synth().toMaster();

const writeMIDI = () => {
    let track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
    let note = new MidiWriter.NoteEvent({pitch: ['C4'], duration: '4'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['E4'], duration: '4'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['C4'], duration: '4'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['E4'], duration: '4'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['G4'], duration: '2'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['G4'], duration: '2'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['C4'], duration: '4'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['E4'], duration: '4'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['C4'], duration: '4'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['E4'], duration: '4'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['G4'], duration: '2'});
    track.addEvent(note);
    note = new MidiWriter.NoteEvent({pitch: ['G4'], duration: '2'});
    track.addEvent(note);
    return new MidiWriter.Writer([track]);
};

const playMidi = (changeNote) => {
    const synth = new Tone.Synth().toMaster();
    MidiConvert.load(writeMIDI().dataUri(), function (midi) {
        Tone.Transport.bpm.value = midi.bpm
        const midiPart = new Tone.Part(function (time, note) {
            console.log({note})
            changeNote(note)
            synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)
        }, midi.tracks[0].notes).start()
        Tone.Transport.start()
    })
};
const mapNoteToFretboard = (note, position, color) => {
    return [[{fretNum: note.midi-55, color, text: note.name}],
        [],
        [],
        [],
        [],
        []
    ]
}
const createSvg = (stringNumber,
                   numberOfFrets,
                   ratio,
                   fullScale,
                   fretWidth,
                   markPoint,
                   fretBoardColor,
                   pointSize,
                   markPointColor,
                   textSize,
                   stringColor,
                   fretsColor,
                   textCorrection,
                   fretHeightCorrection,
                   fretData)=> {
    let fretStuff = fretData.map((string, stringIndex)=> {
        return string.map(fret=> {
            let origo = {
                x: (fullScale - fullScale / Math.pow(2, (fret.fretNum - 1) / ratio) + fullScale - fullScale / Math.pow(2, fret.fretNum / ratio)) / 2,
                y: ((fullScale / ratio) / (stringNumber)) / 2 + ((fullScale / ratio)) / (stringNumber) * stringIndex
            };
            let fretLength = {
                x: ((fullScale - fullScale / Math.pow(2, fret.fretNum / ratio)) - (fullScale - fullScale / Math.pow(2, (fret.fretNum - 1) / ratio))) - fretWidth * 2,
                y: ((fullScale / ratio) / stringNumber)
            };
            return [<rect x={origo.x-fretLength.x/2} y={origo.y-(fretLength.y/2)} width={fretLength.x+fretWidth}
                          height={fretLength.y-fretHeightCorrection}
                          fill={fret.color}/>,
                <text x={origo.x} y={origo.y+textCorrection} fontSize={textSize}>{fret.text}</text>]

        })
    });

    let frets = Array.from(new Array(numberOfFrets)).map((item, index) => {
        return <rect key={index} x={fullScale-fullScale/Math.pow(2,index/ratio)} y="0" width={fretWidth}
                     height={fullScale/ratio}
                     fill={fretsColor}/>
    });

    let strings = Array.from(new Array(stringNumber)).map((item, index) => {

        return <rect key={index} x={fretWidth}
                     y={((fullScale/ratio)/(stringNumber))/2+((fullScale/ratio)/stringNumber)*index}
                     width={fullScale-fullScale/Math.pow(2,numberOfFrets/ratio)} height={3+index}
                     fill={stringColor}/>
    });

    let fretBoardPoint = markPoint.map((item, index)=> {
        if (item > numberOfFrets) return undefined;
        let returnCircle;
        if (item == 12 || item == 24) {
            returnCircle = [
                <circle key={"down"+index}
                        cx={(fullScale-fullScale/Math.pow(2,(item-1)/ratio)+fullScale-fullScale/Math.pow(2,item/ratio))/2+fretWidth/2}
                        cy={(fullScale/ratio/4)*3} r={pointSize} fill={markPointColor}/>,

                <circle key={"up"+index}
                        cx={(fullScale-fullScale/Math.pow(2,(item-1)/ratio)+fullScale-fullScale/Math.pow(2,item/ratio))/2+fretWidth/2}
                        cy={(fullScale/ratio/4)} r={pointSize} fill={markPointColor}/>]
        } else {
            returnCircle =
                <circle key={index}
                        cx={(fullScale-fullScale/Math.pow(2,(item-1)/ratio)+fullScale-fullScale/Math.pow(2,item/15))/2+fretWidth/2}
                        cy={fullScale/ratio/2} r={pointSize} fill={markPointColor}/>
        }
        return returnCircle;
    });
    return <svg width={fullScale} height={fullScale/ratio}>
        <rect x="0" y="0" width={fullScale-fullScale/Math.pow(2,numberOfFrets/ratio)} height={fullScale/ratio}
              fill={fretBoardColor}/>
        {frets}
        {fretBoardPoint}
        {strings}
        {fretStuff}
    </svg>


}
class HomeView extends React.Component {
    componentDidMount() {
        playMidi(this.props.changeNote)
    }

    render() {
        console.log("render")
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
        let fretData = mapNoteToFretboard(this.props.currentNote, 0, "red")
        return <div>
            {createSvg(stringNumber,
                numberOfFrets,
                ratio,
                fullScale,
                fretWidth,
                markPoint,
                fretBoardColor,
                pointSize,
                markPointColor,
                textSize,
                stringColor,
                fretsColor,
                textCorrection,
                fretHeightCorrection,
                fretData)}
        </div>
    }
}
;
const mapStateToProps = (state, ownProps) => {
    return {
        currentNote: state.currentNote
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeNote: (note) => {
            dispatch(changeCurrentNote(note))
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeView)
