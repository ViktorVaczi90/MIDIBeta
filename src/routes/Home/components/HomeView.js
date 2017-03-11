import React from 'react'
import MidiConvert from 'midiconvert';
import Tone from 'tone';

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

const playMidi = () => {
    const synth = new Tone.Synth().toMaster();
    MidiConvert.load(writeMIDI().dataUri(), function (midi) {
        Tone.Transport.bpm.value = midi.bpm
        const midiPart = new Tone.Part(function (time, note) {
            synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)
        }, midi.tracks[0].notes).start()
        Tone.Transport.start()
    })
};

export const HomeView = () => {
    let stringNumber = 5;
    let numberOfFrets = 22;
    let ratio = 15;
    let fullScale = 2500;
    let fretWidth = ratio/2.5;
    let markPoint = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    let fretBoardColor = "#fee4b4";
    let pointSize = ratio/2;
    let markPointColor = "back"
    let textSize = 40;
    let stringColor = "#DAA520";
    let fretsColor = "#C0C0C0";
    let textCorrection = 5;
    let fretHeightCorrection = 4;
    let fretData = [
        [{fretNum: 4, color: "red", text: "C#"}, {fretNum: 3, color: "green", text: "3"}],
        [{fretNum: 4, color: "red", text: "C#"}, {fretNum: 5, color: "red", text: "C#"}],
        [{fretNum: 4, color: "green", text: "3"}, {fretNum: 7, color: "red", text: "C#"}],
        [{fretNum: 9, color: "red", text: "C#"}, {fretNum: 12, color: "red", text: "C#"}],
        [{fretNum: 7, color: "red", text: "C#"}, {fretNum: 2, color: "red", text: "C#"}],
        [{fretNum: 1, color: "red", text: "C#"}, {fretNum: 4, color: "red", text: "C#"}]
    ];
    let fretStuff = fretData.map((string, stringIndex)=> {
        return string.map(fret=> {
            let origo = {
                x: (fullScale - fullScale / Math.pow(2, (fret.fretNum - 1) / 15) + fullScale - fullScale / Math.pow(2, fret.fretNum / 15)) / 2,
                y: ((fullScale / ratio) / (stringNumber)) / 2 + ((fullScale / ratio)) / (stringNumber) * stringIndex
            };
            let fretLength = {
                x: ((fullScale - fullScale / Math.pow(2, fret.fretNum / 15)) - (fullScale - fullScale / Math.pow(2, (fret.fretNum - 1) / 15))) - fretWidth * 2,
                y: ((fullScale/ratio)/stringNumber)
            };
            return [<rect x={origo.x-fretLength.x/2} y={origo.y-(fretLength.y/2)} width={fretLength.x+fretWidth} height={fretLength.y-fretHeightCorrection}
                          fill={fret.color}/>,
                <text x={origo.x} y={origo.y+textCorrection} font-size={textSize}>{fret.text}</text>]

        })
    });

    console.log({fretStuff});

    let frets = Array.from(new Array(numberOfFrets)).map((item, index) => {
        return <rect x={fullScale-fullScale/Math.pow(2,index/15)} y="0" width={fretWidth} height={fullScale/ratio}
                     fill={fretsColor}/>
    });
    let strings = Array.from(new Array(stringNumber)).map((item, index) => {
        return <rect x={fretWidth} y={((fullScale/ratio)/(stringNumber))/2+((fullScale/ratio)/stringNumber)*index}
                     width={fullScale-fullScale/Math.pow(2,numberOfFrets/15)} height="3"
                     fill={stringColor}/>
    });

    let fretBoardPoint = markPoint.map((item, index)=> {
        let returnCircle;
        if (item == 12 || item == 24) {
            returnCircle = [
                <circle cx={(fullScale-fullScale/Math.pow(2,(item-1)/15)+fullScale-fullScale/Math.pow(2,item/15))/2+fretWidth/2}
                        cy={(fullScale/ratio/4)*3} r={pointSize} fill={markPointColor}/>,

                <circle cx={(fullScale-fullScale/Math.pow(2,(item-1)/15)+fullScale-fullScale/Math.pow(2,item/15))/2+fretWidth/2}
                        cy={(fullScale/ratio/4)} r={pointSize} fill={markPointColor}/>]
        } else {
            returnCircle =
                <circle cx={(fullScale-fullScale/Math.pow(2,(item-1)/15)+fullScale-fullScale/Math.pow(2,item/15))/2+fretWidth/2}
                        cy={fullScale/ratio/2} r={pointSize} fill={markPointColor}/>
        }
        return returnCircle;
    });


    return <div>
        <svg width={fullScale} height={fullScale/ratio}>
            <rect x="0" y="0" width={fullScale-fullScale/Math.pow(2,numberOfFrets/15)} height={fullScale/ratio} fill={fretBoardColor}/>
            {frets}
            {fretBoardPoint}
            {strings}
            {fretStuff}
        </svg>
        {playMidi()}
    </div>
};

export default HomeView
