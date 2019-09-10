import MidiWriter from 'midi-writer-js';
import * as constants from './constants';

export default ({ bpm, channel, frames, duration }) => {
  const track = new MidiWriter.Track();
  track.setTimeSignature(4, 4);
  track.setTempo(bpm);
  frames.forEach((frame) => {
    const notes = [];
    frame.forEach((row) => {
      row.forEach((note) => {
        if (note.velocity > constants.NOTE_OFF) {
          notes.push(note);
        }
      })
    });
    track.addEvent(new MidiWriter.NoteEvent({
      channel,
      duration,
      pitch: notes.length ? notes.map((note) => note.cc) : [0],
      velocity: notes.map((note) => note.velocity)[0] || 0,
    }))
  });
  const midi = new MidiWriter.Writer(track);
  return midi.buildFile()
}
