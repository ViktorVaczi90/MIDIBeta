import React from 'react'
import MidiConvert from 'midiconvert';
import Tone from 'tone';
import { connect } from 'react-redux'
import { changeCurrentNote } from '../../../store/currentNote'
import './HomeView.scss'

// random note generator
let inputNotes = [36, 39, 41, 43, 46, 48];
let noteGenerate = (inputNotes, numberOfNotes) => {
    let randomNotes = [];
    for (let len = 0; len < numberOfNotes; ++len) {
        let note = inputNotes
            .filter((value) => value != randomNotes[randomNotes.length - 1])[Math.floor(Math.random() * (inputNotes.length - 1))];
        randomNotes.push(note)
    }
    return randomNotes;
};
let random = (arr) => {
    console.log(arr);
    let noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return arr.map(item=> noteList[item % 12] + Math.floor(item / 12));
};
const FFT = require('jsfft');
//import {Model} from '../../../kerasSrc/keras'
import { Model } from 'keras-js'
const MidiWriter = require('midi-writer-js');
const synth = new Tone.Synth().toMaster();
const writeMIDI = () => {
    let track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
    let generateNote = random(noteGenerate(inputNotes, 1001));
    for (let counter = 0; counter < generateNote.length; counter++) {
        {
            console.log(counter);
            let note = new MidiWriter.NoteEvent({pitch: [generateNote[counter]], duration: '16'});
            track.addEvent(note);
        }
    }
    return new MidiWriter.Writer([track]);
};
const playMidi = (changeNote) => {
    const synth = new Tone.Synth().toMaster();
    MidiConvert.load(writeMIDI().dataUri(), function (midi) {
        Tone.Transport.bpm.value = midi.bpm
        const midiPart = new Tone.Part(function (time, note) {
            changeNote(note)
            synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)
        }, midi.tracks[0].notes).start()
        Tone.Transport.start()
    })
};
const mapNoteToFretboard = (note, position, color, stringStarts = [64, 59, 55, 50, 45, 40]) => {
    let good = stringStarts
        .map(i=>note.midi - i)
        .map(i=>[{fretPosition: i}])
        .map(i=>i.filter(obj=>obj.fretPosition >= 0))
    let bestFit = good.reduce((acc, curr)=> {
        if (!curr.length) {
            return acc

        }
        if (curr[0].fretPosition - position >= 0 && curr[0].fretPosition - position < acc) return curr[0].fretPosition - position
        return acc
    }, 999);
    let ready = good
        .map((i, stringIndex)=>
            i.filter(item => item.fretPosition - position === bestFit)
                .map(item => ({fretNum: note.midi - stringStarts[stringIndex], color, text: note.name})))
    return ready


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
                   fretData,
                   horizontalShift,
                   verticalShift)=> {
    // Displays the notes with the name of them on the fretboard
    let fretStuff = fretData.map((string, stringIndex)=> {
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
    });
    // Displays nut
    let nut = () => {
        return <rect x={horizontalShift - fretWidth - 35 / 2} y={verticalShift} width="35"
                     height={(fullScale / ratio)}
                     fill={fretsColor}/>
    };
    // Define: the distance of the frets
    let frets = Array.from(new Array(numberOfFrets)).map((item, index) => {
        return <rect key={index} x={horizontalShift + (fullScale - fullScale / Math.pow(2, index / ratio))}
                     y={verticalShift}
                     width={fretWidth}
                     height={fullScale / ratio}
                     fill={fretsColor}/>
    });
    // Displays the strings according to stringNumber
    let strings = Array.from(new Array(stringNumber)).map((item, index) => {

        return <rect key={index} x={horizontalShift + fretWidth}
                     y={verticalShift + (((fullScale / ratio) / (stringNumber)) / 2 + ((fullScale / ratio) / stringNumber) * index)}
                     width={fullScale - fullScale / Math.pow(2, numberOfFrets / ratio)} height={3 + index}
                     fill={stringColor}/>
    });
    // Display the mark points on the guitar neck
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
    // Displays blank fretboard without frets or strings
    let blankFretboard = () => {
        return <rect x={horizontalShift} y={verticalShift}
                     width={fullScale - fullScale / Math.pow(2, numberOfFrets / ratio)}
                     height={fullScale / ratio}
                     fill={fretBoardColor}/>
    };
    return <svg width={fullScale} height={verticalShift + (fullScale / ratio) + verticalShift}>
        {blankFretboard()}
        {frets}
        {fretBoardPoint}
        {nut()}
        {strings}
        {fretStuff}
    </svg>
};
let handleSuccess = (stream) => {
    let context = new window.AudioContext()
    let input = context.createMediaStreamSource(stream)
    var processor = context.createScriptProcessor(1024, 1, 1)
    input.connect(processor)
    processor.connect(context.destination)
    processor.onaudioprocess = (e) => {
        let inputBuffer = e.inputBuffer;
        var outputBuffer = e.outputBuffer;
        for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            var inputData = inputBuffer.getChannelData(channel).filter((item, index)=> index % 2);
            if (!once) {
                //once = 1
                let data = new FFT.ComplexArray(512).map((value, index)=>value.real = inputData[index])
                let freqs = data.FFT()
                let results = new Array(257).fill(0).map((curr, idx)=>Math.sqrt(freqs.real[idx] * freqs.real[idx] + freqs.imag[idx] * freqs.imag[idx]))
                //console.log({ results, model })
                var outputData = outputBuffer.getChannelData(channel);
                model.ready()
                    .then(() => {
                        const dataToPredictFrom = {
                            'input': new Float32Array(results)
                        }
                        model.predict(dataToPredictFrom)
                            .then(data => {
                                const currentNote = {
                                    note: data.output.indexOf(Math.max(...data.output)),
                                    probability: Math.max(...data.output)
                                }
                                if (currentNote.probability > 0.8) {
                                    console.log(currentNote)
                                    filteredNotes.pop(0)
                                    filteredNotes.push(currentNote)
                                    //console.log({maxNote,numberOfNoteInFilter})
                                    /*                  console.log({
                                     note: filteredNotes.reduce((acc, curr)=> {
                                     acc[curr] ? acc[curr]++ : acc[curr] = 1;
                                     return acc
                                     }, {})
                                     })*/
                                }
                                //console.log({out:data.output, max: data.output.indexOf(Math.max(...data.output)),prob:Math.max(...data.output)})
                            })
                    })
            }


            for (var sample = 0; sample < inputBuffer.length; sample++) {
                //outputData[sample] = inputData[sample]; // To MAKE SOME NOOIIZZEE
            }
        }
    }
}
class HomeView extends React.Component {
    componentDidMount() {
        playMidi(this.props.changeNote);
        navigator.getUserMedia({audio: true, video: false}, handleSuccess, console.log)
    }

    render() {
        let stringNumber = 6;
        let numberOfFrets = 16;
        let ratio = 15;
        let fullScale = 2500;
        let fretWidth = ratio / 2.5;
        let markPoint = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        let fretBoardColor = "#fee4b4";
        let pointSize = ratio / 2;
        let markPointColor = "back";
        let textSize = 20;
        let stringColor = "#DAA520";
        let fretsColor = "#C0C0C0";
        let textCorrection = 5;
        let fretHeightCorrection = 4;
        let fretData = mapNoteToFretboard(this.props.currentNote, 5, "green");
        let horizontalShift = 400;
        let verticalShift = 200;
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
                fretData,
                horizontalShift,
                verticalShift)}
        </div>
    }

    componentDidMount() {
        playMidi(this.props.changeNote)
        navigator.getUserMedia({audio: true, video: false}, handleSuccess, console.log)
    }

    render() {
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
        let fretData = mapNoteToFretboard(this.props.currentNote, 5, "green");
        let horizontalShift = 400;
        let verticalShift = 200;
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
                fretData,
                horizontalShift,
                verticalShift)}
        </div>
    }
}
;
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
    })
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeView)
