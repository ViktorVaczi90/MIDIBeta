import React from 'react'
import PitchFinder from 'pitchfinder'
import { connect } from 'react-redux'

import { changeCurrentFreq } from '../../../store/currentFreq'
import './TunerView.scss'

const detectPitch = new PitchFinder.YIN();
let localStream = undefined;

class Tuner extends React.Component {
    constructor(props) {
        super(props)
        this.handleSuccess = this.handleSuccess.bind(this)
    }

    componentDidMount() {
        navigator.getUserMedia({audio: true, video: false}, this.handleSuccess, console.log)
    }

    componentWillUnmount() {
        localStream.getAudioTracks().forEach(track => track.stop())
    }

    handleSuccess(stream) {
        if (!localStream) localStream = stream;
        let context = new window.AudioContext()
        let input = context.createMediaStreamSource(stream)
        var processor = context.createScriptProcessor(8192, 1, 1)
        input.connect(processor)
        processor.connect(context.destination)
        processor.onaudioprocess = (e) => {
            let inputBuffer = e.inputBuffer;
            for (var channel = 0; channel < inputBuffer.numberOfChannels; channel++) {
                let pitch = detectPitch(inputBuffer.getChannelData(channel))
                pitch < 1000 ? this.props.changeFreq(pitch) : undefined
                for (var sample = 0; sample < inputBuffer.length; sample++) {
                }
            }
        }
    }

    render() {
        let pointerLength = 250;
        let pointerBaseX = 350;
        let pointerBaseY = 350;

        let noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        noteList = noteList.concat(noteList, noteList, noteList, noteList);
        let noteIndex = 1;
        noteList = noteList.map((item, index) => {
            if (index % 12 == 0) {
                noteIndex++;
            }
            noteList = item + noteIndex;
            return noteList
        });
        let fx = this.props.currentFreq; //input frequency
        let f0 = 440;
        let a = Math.pow(2, (1 / 12));
        let fN = [];
        for (let n = -((Math.floor(noteList.length / 12) / 2) * 12 + 3);
             n <= (noteList.length - ((Math.floor(noteList.length / 12) / 2) * 12 + 4)); n++) {
            fN.push(f0 * Math.pow(a, n))
        }
        let tunerOutline = () => {
            return <rect x="0" y="0" width={700} height={450} stroke="black" fill="white" rx={10} ry={10}/>
        };
        let textNote = () => {
            return <text x="320" y="70" fontFamily="Verdana" fontSize="35">
                {listOfNotesFreqs()}
            </text>
        };
        let textLeftNote = () => {
            return <text x="100" y="120" fontFamily="Verdana" fontSize="35">
                {leftNote()}
            </text>
        };
        let textRightNote = () => {
            return <text x="540" y="120" fontFamily="Verdana" fontSize="35">
                {rightNote()}
            </text>
        };
        let textFreq = () => {
            let roundFreq = Math.round(fx * 100) / 100;

            return <text x="310" y="400" fontFamily="Verdana" fontSize="35">
                {roundFreq}
            </text>
        };
        let pointer = () => {
            let pointerX = {
                a: (Math.cos((45 + 45 / 4 * 3) * Math.PI / 180) * pointerLength),
                b: (Math.cos((45 + 45 / 4 * 2) * Math.PI / 180) * pointerLength),
                c: (Math.cos((45 + 45 / 4) * Math.PI / 180) * pointerLength),
                d: (Math.cos(45 * Math.PI / 180) * pointerLength)
            };
            let pointerY = {
                a: (Math.sin((45 + 45 / 4 * 3) * Math.PI / 180) * pointerLength),
                b: (Math.sin((45 + 45 / 4 * 2) * Math.PI / 180) * pointerLength),
                c: (Math.sin((45 + 45 / 4) * Math.PI / 180) * pointerLength),
                d: (Math.sin(45 * Math.PI / 180) * pointerLength)
            };
            return fN.map((item, index)=> {
                if (item == fx || fx < item - (item / 100 * 5) || fx > item + (item / 100 * 5)) {
                    return <line x1={pointerBaseX} y1={pointerBaseY} x2={pointerBaseX} y2={pointerBaseY-pointerLength}
                                 strokeWidth="5" stroke="black"/>
                } else if (fx > item && fx < (fN[index + 1])) {
                    if (fx < ((fN[index + 1] - item) / 2 + item)) {
                        return <line x1={pointerBaseX} y1={pointerBaseY} x2={pointerBaseX+pointerX.a}
                                     y2={pointerBaseY-pointerY.a} strokeWidth="5" stroke="black"/>
                    } else if (fx > ((item - fN[index - 1]) / 2 + fN[index - 1])) {
                        return <line x1={pointerBaseX} y1={pointerBaseY} x2={pointerBaseX-pointerX.a}
                                     y2={pointerBaseY-pointerY.a} strokeWidth="5" stroke="black"/>
                    } else if (fx < ((item - fN[index - 1]) / 2 + fN[index - 1])) {
                        return <line x1={pointerBaseX} y1={pointerBaseY} x2={pointerBaseX-pointerX.c}
                                     y2={pointerBaseY-pointerY.a} strokeWidth="5" stroke="black"/>
                    } else if (fx > ((fN[index + 1] - item) / 2 + item)) {
                        return <line x1={pointerBaseX} y1={pointerBaseY} x2={pointerBaseX+pointerX.c}
                                     y2={pointerBaseY-pointerY.c} strokeWidth="5" stroke="black"/>
                    }
                }
            });
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

            return fN.map((item, index)=> {
                if (item == fx) {
                    return noteList[index]
                } else if (fx > item && fx < (fN[index + 1])) {
                    if (fx < ((fN[index + 1] - item) / 2 + item)) {
                        return noteList[index]
                    } else if (fx > ((fN[index + 1] - item) / 2 + item)) {
                        return noteList[index + 1]
                    }
                }
            });
        };
        let leftNote = () => {
            return fN.map((item, index)=> {
                if (item == fx) {
                    return noteList[index]
                } else if (fx > item && fx < (fN[index + 1])) {
                    if (fx < ((fN[index + 1] - item) / 2 + item)) {
                        return noteList[index - 1]
                    } else if (fx > ((fN[index + 1] - item) / 2 + item)) {
                        return noteList[index]
                    }
                }
            });
        };
        let rightNote = () => {
            return fN.map((item, index)=> {
                if (item == fx) {
                    return noteList[index]
                } else if (fx > item && fx < (fN[index + 1])) {
                    if (fx < ((fN[index + 1] - item) / 2 + item)) {
                        return noteList[index + 1]
                    } else if (fx > ((fN[index + 1] - item) / 2 + item)) {
                        return noteList[index + 2]
                    }
                }
            });
        };

        return <div>
            <p>Current freq: {this.props.currentFreq}</p>
            <svg width={1000} height={1000}>
                {tunerOutline()}
                {textNote()}
                {pointer()}
                {textFreq()}
                {textLeftNote()}
                {textRightNote()}


            </svg>
        </div>
    }

}
const mapStateToProps = (state, ownProps) => {
    return {
        currentFreq: state.currentFreq
    }
};

const mapDispatchToProps = (dispatch) =>
    ( {
        changeFreq: (freq) => {
            dispatch(changeCurrentFreq(freq))
        }
    })
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tuner)