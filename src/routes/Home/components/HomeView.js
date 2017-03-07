import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './HomeView.scss'
import MidiConvert from 'midiconvert';
import MIDI from 'midi.js'
import Tone from 'tone';

const MidiWriter = require('midi-writer-js');

var synth = new Tone.Synth().toMaster();

const writeMIDI = () => {
  // Start with a new track
  var track = new MidiWriter.Track();

// Define an instrument (optional):
  track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));

// Add some notes:
  var note = new MidiWriter.NoteEvent({ pitch: ['C4'], duration: '4' });
  track.addEvent(note);
  var note = new MidiWriter.NoteEvent({ pitch: ['D4'], duration: '4' });
  track.addEvent(note);
  var note = new MidiWriter.NoteEvent({ pitch: [ 'E4'], duration: '4' });
  track.addEvent(note);

// Generate a data URI
  return new MidiWriter.Writer([track]);
//console.log(write.dataUri());
};

const playMidi = () => {
  var synth = new Tone.Synth().toMaster();
  MidiConvert.load(writeMIDI().dataUri(), function (midi) {
    Tone.Transport.bpm.value = midi.bpm
    var midiPart = new Tone.Part(function (time, note) {
      synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)
    }, midi.tracks[0].notes).start()

    Tone.Transport.start()
  })
};

export const HomeView = () => (
  <div>
    <h4>Welcome!</h4>
    <img
      alt='This is a duck, because Redux!'
      className='duck'
      src={DuckImage} />
    {playMidi()}
  </div>
)

export default HomeView
