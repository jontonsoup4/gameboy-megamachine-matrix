export default (midi) => {
  const blob = new Blob([midi], {type: 'audio/midi'});
  const a = document.createElement('a');
  a.download = `MIDI_${new Date().getTime()}.mid`;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['audio/midi', a.download, a.href].join(':');
  document.body.appendChild(a);
  a.click();
  a.remove();
};
