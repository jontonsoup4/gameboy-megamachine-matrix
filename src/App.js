import Controls from './components/Controls';
import Gameboy from './components/Gameboy'
import generateMIDI from './utils/generateMIDI';
import Grid from '@material-ui/core/Grid';
import Interval from './utils/interval';
import React, { useCallback, useEffect, useState } from 'react';
import Ribbon from './components/Ribbon';
import styles from './styles';
import * as constants from './utils/constants'

const copyArray = (arr) => JSON.parse(JSON.stringify(arr));
let cc = constants.STARTING_NOTE;
const initState = copyArray(constants.EMPTY_MATRIX.map((row) => row.map(() => {
  const item = {
    cc,
    velocity: 0,
  };
  cc += 1;
  return item;
})).reverse());

let interval = null;

export default () => {
  const classes = styles();
  const [frames, setFrames] = useState([copyArray(initState)]);
  const [frame, setFrame] = useState(0);
  const [activeItem, setActiveItem] = useState(null);
  const [mouseActive, setMouseActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(constants.DEFAULT_BPM);
  const [subdivision, setSubdivision] = useState(constants.NOTE_LENGTHS.EIGHTH.value);

  const nextFrame = useCallback((framesLength = null) => {
    setFrame((frame) => frame >= (framesLength || frames.length) - 1 ? 0 : frame + 1);
  }, [frames, setFrame]);

  const calculateBpm = (b, s) => b * (s / 4);

  const startAnimation = useCallback(() => {
    if (frames.length <= 1) {
      return;
    }
    setIsPlaying(true);
    if (interval) {
      interval.stop();
    }
    interval = new Interval({
      bpm: calculateBpm(bpm, subdivision),
      callback: () => nextFrame(),
    });
    interval.run();
  }, [bpm, frames, nextFrame, setIsPlaying, subdivision]);

  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
    if (interval) {
      interval.stop();
    }
  }, [setIsPlaying]);

  const updateBpm = useCallback((newBpm) => {
    setBpm(newBpm);
    if (isPlaying) {
      interval.stop();
      interval = new Interval({
        bpm: calculateBpm(newBpm, subdivision),
        callback: () => nextFrame(),
      });
      interval.run()
    }
  }, [nextFrame, isPlaying, setBpm, subdivision]);

  const updateSubdivision = useCallback((newSubdivision) => {
    setSubdivision(newSubdivision);
    if (isPlaying) {
      interval.stop();
      interval = new Interval({
        bpm: calculateBpm(bpm, newSubdivision),
        callback: () => nextFrame(),
      });
      interval.run();
    }
  }, [bpm, nextFrame, isPlaying, setSubdivision]);

  const matrix = frames[Math.min(frame, frames.length - 1)];

  const addFrame = useCallback(() => {
    if (isPlaying) {
      return;
    }
    const newFrames = copyArray(frames);
    newFrames.push(copyArray(initState));
    setFrames(newFrames);
    nextFrame(newFrames.length);
  }, [frames, isPlaying, nextFrame]);

  const setCurrentFrame = useCallback((newMatrix) => {
    const newFrames = copyArray(frames);
    newFrames[frame] = newMatrix;
    setFrames(newFrames)
  }, [frame, frames, setFrames]);

  const setCurrentElement  = ([row, column]) => {
    const newMatrix = copyArray(matrix);
    const currentItem = newMatrix[row][column];
    const currentItemOn = currentItem.velocity === constants.NOTE_OFF;
    newMatrix[row][column].velocity = currentItemOn ? constants.NOTE_ON : constants.NOTE_OFF;
    setCurrentFrame(newMatrix)
  };

  const previousFrame = useCallback((newFrames = null) => {
    setFrame((frame) => frame <= 0 ? (newFrames || frames.length) - 1 : frame - 1);
  }, [frames, setFrame]);

  const clearFrame = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setCurrentFrame(copyArray(initState));
  }, [isPlaying, setCurrentFrame]);

  const copyFrame = useCallback(() => {
    if (isPlaying) {
      return;
    }
    const newFrames = copyArray(frames);
    const copiedFrame = copyArray(matrix);
    newFrames.splice(frame + 1, 0, copiedFrame);
    setFrames(newFrames);
    nextFrame(newFrames.length);
  }, [frame, frames, isPlaying, matrix, nextFrame, setFrames]);

  const deleteFrame = useCallback(() => {
    if (isPlaying) {
      return;
    }
    if (frame === 0 && frames.length === 1) {
      clearFrame();
      return;
    }
    const newFrames = copyArray(frames);
    newFrames.splice(frame, 1);
    setFrames(newFrames);
    previousFrame(newFrames.length);
  }, [clearFrame, frame, frames, isPlaying, previousFrame]);

  const download = useCallback(() => {
    pauseAnimation();
    const midi = generateMIDI({
      bpm,
      channel: constants.MIDI_CHANNEL,
      duration: subdivision,
      frames
    });
    const blob = new Blob([midi], {type: 'audio/midi'});
    const a = document.createElement('a');
    a.download = `MIDI_${new Date().getTime()}.mid`;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['audio/midi', a.download, a.href].join(':');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [bpm, frames, pauseAnimation, subdivision]);

  const handleOnMouseDown = () => {
    if (activeItem) {
      setCurrentElement(activeItem);
      setMouseActive(true);
    }
  };

  const handleOnMouseOut = () => {
    setActiveItem(null);
  };

  const handleOnMouseOver = (row, column) => (e) => {
    setActiveItem([row, column]);
    if (mouseActive) {
      setCurrentElement([row, column]);
    }
  };

  const goToFirstFrame = useCallback(() => {
    setFrame(0);
  }, [setFrame]);

  const goToLastFrame = useCallback(() => {
    setFrame(frames.length - 1);
  }, [frames, setFrame]);

  const mapCCtoNewMatrix = (newMatrix, oldMatrix) => {
    return newMatrix.map((r, ri) => r.map((m, ci) => ({
      cc: oldMatrix[ri][ci].cc,
      velocity: m.velocity,
    })))
  };

  const translateMatrix = useCallback((direction) => {
    if (direction === 'up') {
      const newMatrix = copyArray(frames[frame]);
      newMatrix.push(newMatrix.shift());
      setCurrentFrame(mapCCtoNewMatrix(newMatrix, frames[frame]));
    } else if (direction === 'down') {
      const newMatrix = copyArray(frames[frame]);
      newMatrix.unshift(newMatrix.pop());
      setCurrentFrame(mapCCtoNewMatrix(newMatrix, frames[frame]));
    } else if (direction === 'left') {
      let newMatrix = copyArray(matrix);
      newMatrix = newMatrix.map((row) => {
        const newRow = copyArray(row);
        newRow.push(newRow.shift());
        return newRow;
      });
      setCurrentFrame(mapCCtoNewMatrix(newMatrix, matrix));
    } else if (direction === 'right') {
      let newMatrix = copyArray(matrix);
      newMatrix = newMatrix.map((row) => {
        const newRow = copyArray(row);
        newRow.unshift(newRow.pop());
        return newRow;
      });
      setCurrentFrame(mapCCtoNewMatrix(newMatrix, matrix));
    }
  }, [frame, frames, matrix, setCurrentFrame]);

  const handleKeyDown = useCallback((event) => {
    const { code, key } = event;
    if (key === constants.KEY_SHORTCUTS.TRANSLATE_UP) {
      translateMatrix('up');
    } else if (key === constants.KEY_SHORTCUTS.TRANSLATE_DOWN) {
      translateMatrix('down');
    } else if (key === constants.KEY_SHORTCUTS.TRANSLATE_LEFT) {
      translateMatrix('left');
    } else if (key === constants.KEY_SHORTCUTS.TRANSLATE_RIGHT) {
      translateMatrix('right');
    } else if (key === constants.KEY_SHORTCUTS.ADD_FRAME) {
      addFrame();
    } else if (key === constants.KEY_SHORTCUTS.COPY_FRAME) {
      copyFrame();
    } else if (key === constants.KEY_SHORTCUTS.CLEAR_FRAME) {
      clearFrame();
    } else if (key === constants.KEY_SHORTCUTS.DELETE_FRAME) {
      deleteFrame();
    } else if (key === constants.KEY_SHORTCUTS.GO_TO_FIRST_FRAME) {
      goToFirstFrame();
    } else if (key === constants.KEY_SHORTCUTS.GO_TO_LAST_FRAME) {
      goToLastFrame();
    } else if (key === constants.KEY_SHORTCUTS.GO_TO_NEXT_FRAME) {
      nextFrame();
    } else if (key === constants.KEY_SHORTCUTS.GO_TO_PREVIOUS_FRAME) {
      previousFrame();
    } else if (key === constants.KEY_SHORTCUTS.DOWNLOAD) {
      download();
    } else if (key === constants.KEY_SHORTCUTS.HELP_MENU) {
      window.showHelp && window.showHelp();
    } else if (code === constants.KEY_SHORTCUTS.START_STOP) {
      if (isPlaying) {
        pauseAnimation();
      } else {
        startAnimation();
      }
    }
  }, [
    addFrame,
    clearFrame,
    copyFrame,
    deleteFrame,
    download,
    goToFirstFrame,
    goToLastFrame,
    isPlaying,
    nextFrame,
    pauseAnimation,
    previousFrame,
    startAnimation,
    translateMatrix,
  ]);

  useEffect(() => {
    window.onmouseup = () => setMouseActive(false);
    window.onkeydown = handleKeyDown;
  }, [handleKeyDown, isPlaying, nextFrame]);

  return (
    <div className={classes['container']}>
      <Ribbon />
      <Grid className={classes['gameboys']} container justify='center' spacing={1}>
        {matrix.map((row, rowIndex) => (
          <Grid
            container
            item xs={12}
            justify='center'
            key={`row (${rowIndex})`}
            spacing={6}
          >
            {row.map((item, columnIndex) => (
              <Grid item key={`column (${rowIndex},${columnIndex})`}>
                <Gameboy
                  isHovered={activeItem && activeItem[0] === rowIndex && activeItem[1] === columnIndex}
                  onMouseDown={handleOnMouseDown}
                  onMouseOut={handleOnMouseOut}
                  onMouseOver={handleOnMouseOver(rowIndex, columnIndex)}
                  velocity={item.velocity}
                />
              </Grid>
            ))}
          </Grid>

        ))}
      </Grid>
      <Controls
        bpm={bpm}
        currentFrame={frame}
        handleAddFrame={addFrame}
        handleClear={clearFrame}
        handleCopyFrame={copyFrame}
        handleDeleteFrame={deleteFrame}
        handleDownload={download}
        handleGoToFirstFrame={goToFirstFrame}
        handleGoToLastFrame={goToLastFrame}
        handleNextFrame={nextFrame}
        handlePause={pauseAnimation}
        handlePreviousFrame={previousFrame}
        handleStart={startAnimation}
        handleTranslate={translateMatrix}
        isPlaying={isPlaying}
        setBpm={updateBpm}
        setSubdivision={updateSubdivision}
        subdivision={subdivision}
        totalFrames={frames.length}
      />
    </div>
  );
}
