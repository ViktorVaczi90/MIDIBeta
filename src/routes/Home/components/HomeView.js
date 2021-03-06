import React from 'react'
import MidiConvert from 'midiconvert';
import Tone from 'tone';
import { connect } from 'react-redux'
import { changeCurrentNote } from '../../../store/currentNote'
import './HomeView.scss'
import Fretboard from '../../../components/Fretboard'
var PitchDetect = require('pitch-detect')
import PitchFinder from 'pitchfinder'
const detectPitch = new PitchFinder.YIN();

const model = new Model({
    filepaths: {
        model: 'http://localhost:3000/model.json',
        weights: 'http://localhost:3000/model_03_18_weights.buf',
        metadata: 'http://localhost:3000/model_03_18_metadata.json'
    },
    gpu: false
})

const FFT = require('jsfft');
import { Model } from 'keras-js'
const MidiWriter = require('midi-writer-js');

import createPlotlyComponent from 'react-plotlyjs';
//See the list of possible plotly bundles at https://github.com/plotly/plotly.js/blob/master/dist/README.md#partial-bundles or roll your own
//import Plotly from 'plotly.js/dist/plotly-cartesian';
//const PlotlyComponent = createPlotlyComponent(Plotly);


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
    let noteList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return arr.map(item=> noteList[item % 12] + Math.floor(item / 12));
};
const writeMIDI = () => {
    let track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 4}));
    let generateNote = random(noteGenerate(inputNotes, 20));
    for (let counter = 0; counter < generateNote.length; counter++) {
        {
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
            //synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)
        }, midi.tracks[0].notes).start()
        Tone.Transport.start()
    })
};
let once = 0;
const filteredNotes = new Array(20).fill(0)
let data = [];
let handleSuccess = (stream) => {
    //let pitchDetect = new PitchDetect(stream);
    let context = new window.AudioContext()
    let input = context.createMediaStreamSource(stream)
    var processor = context.createScriptProcessor(8192, 1, 1)
    input.connect(processor)
    processor.connect(context.destination)
    processor.onaudioprocess = (e) => {
/*        let resultt = pitchDetect.getPitch()
        if (resultt.type != "vague")
            console.log(resultt)*/
        let inputBuffer = e.inputBuffer;
        var outputBuffer = e.outputBuffer;
        for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            var inputData = inputBuffer.getChannelData(channel).filter((item, index)=> index % 2);
            let pitch = detectPitch(inputBuffer.getChannelData(channel))
            pitch<1000?console.log(pitch):undefined
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
                                    //console.log(currentNote)
                                    filteredNotes.pop(0)
                                    filteredNotes.push(currentNote)
                                    //getNoteData = new Array(inputBuffer.getChannelData(channel).length).fill(0)
                                    //inputBuffer.getChannelData(channel)
                                }
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
        playMidi(this.props.changeNote)
        navigator.getUserMedia({audio: true, video: false}, handleSuccess, console.log)
    }

    render() {

        return <div>
            <Fretboard notes={5}/>
        </div>
    }
}
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
