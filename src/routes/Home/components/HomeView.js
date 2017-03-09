import React from 'react'
import MidiConvert from 'midiconvert';
import Tone from 'tone';

import './HomeView.scss'

const MidiWriter = require('midi-writer-js');
const synth = new Tone.Synth().toMaster();

const writeMIDI = () => {
  let track = new MidiWriter.Track();
  track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
  let note = new MidiWriter.NoteEvent({ pitch: ['C4'], duration: '4' });
  track.addEvent(note);
  note = new MidiWriter.NoteEvent({ pitch: ['D4'], duration: '4' });
  track.addEvent(note);
  note = new MidiWriter.NoteEvent({ pitch: [ 'E4'], duration: '4' });
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

export const HomeView = () =>
{
  let stringNumber = 6;
  let ratio = 15;
  let fullScale = 3000;
  let frets = Array.from(new Array(13)).map((item,index) =>{
    return <rect x={fullScale-fullScale/Math.pow(2,index/15)} y="0" width="7" height={fullScale/ratio} fill="#C0C0C0"  />
  })
  return <div>
    <svg width={fullScale} height="200">
      <rect x="0" y="0" width={fullScale/1.7} height={fullScale/ratio} fill="#8B4513" />
      {frets}
    </svg>
    {playMidi()}
  </div>
}

export default HomeView
