import * as constants from 'utils/constants'
import Controls from 'components/Controls';
import download from 'utils/download';
import Gameboy from 'components/Gameboy'
import generateMIDI from 'utils/generateMIDI';
import Grid from '@material-ui/core/Grid';
import Interval from 'utils/interval';
import React, { useCallback, useEffect, useState } from 'react';
import Ribbon from 'components/Ribbon';
import styles from './styles';
import { calculateBpm } from 'utils/bpm';
import { copyArray, shift } from 'utils/transformations';
import { getInitialState } from 'utils/state';

let interval = null;

export default () => {
  const classes = styles();

  const [activeItem, setActiveItem] = useState(null);
  const [bpm, setBpm] = useState(constants.DEFAULT_BPM);
  const [frame, setFrame] = useState(0);
  const [frames, setFrames] = useState([copyArray(getInitialState())]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mouseActive, setMouseActive] = useState(false);
  const [subdivision, setSubdivision] = useState(constants.NOTE_LENGTHS.EIGHTH.value);
  const [velocity, setVelocity] = useState(constants.DEFAULT_VELOCITY);

  const nextFrame = useCallback((framesLength = null) => {
    setFrame((frame) => frame >= (framesLength || frames.length) - 1 ? 0 : frame + 1);
  }, [frames, setFrame]);

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
    const newFrame = frame + 1;
    const newFrames = copyArray(frames);
    newFrames.splice(newFrame, 0, copyArray(getInitialState()));
    setFrames(newFrames);
    nextFrame(newFrames.length);
  }, [frame, frames, isPlaying, nextFrame]);

  const setCurrentFrame = useCallback((newMatrix) => {
    const newFrames = copyArray(frames);
    newFrames[frame] = newMatrix;
    setFrames(newFrames)
  }, [frame, frames, setFrames]);

  const setCurrentElement  = ([row, column]) => {
    const newMatrix = copyArray(matrix);
    const currentItem = newMatrix[row][column];
    newMatrix[row][column].velocity = currentItem.velocity !== velocity ? velocity : constants.NOTE_OFF;
    setCurrentFrame(newMatrix)
  };

  const previousFrame = useCallback((newFrames = null) => {
    setFrame((frame) => frame <= 0 ? (newFrames || frames.length) - 1 : frame - 1);
  }, [frames, setFrame]);

  const clearFrame = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setCurrentFrame(copyArray(getInitialState()));
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

  const downloadMIDI = useCallback(() => {
    if (isPlaying) {
      pauseAnimation();
    }
    const midi = generateMIDI({
      bpm,
      channel: constants.MIDI_CHANNEL,
      duration: subdivision,
      frames
    });
    download(midi);
  }, [bpm, frames, isPlaying, pauseAnimation, subdivision]);

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

  const translateMatrix = useCallback((direction) => {
    setCurrentFrame(shift[direction](matrix));
  }, [matrix, setCurrentFrame]);

  const handleSetVelocity = (value) => {
    setVelocity(Math.min(Math.max(parseInt(value), constants.MIN_VELOCITY), constants.MAX_VELOCITY));
  };

  const handleKeyDown = useCallback((event) => {
    const { key } = event;
    const actions = {
      [constants.KEY_SHORTCUTS.TRANSLATE_UP]: () => translateMatrix(constants.DIRECTIONS.UP),
      [constants.KEY_SHORTCUTS.TRANSLATE_DOWN]: () => translateMatrix(constants.DIRECTIONS.DOWN),
      [constants.KEY_SHORTCUTS.TRANSLATE_LEFT]: () => translateMatrix(constants.DIRECTIONS.LEFT),
      [constants.KEY_SHORTCUTS.TRANSLATE_RIGHT]: () => translateMatrix(constants.DIRECTIONS.RIGHT),
      [constants.KEY_SHORTCUTS.ADD_FRAME]: addFrame,
      [constants.KEY_SHORTCUTS.COPY_FRAME]: copyFrame,
      [constants.KEY_SHORTCUTS.CLEAR_FRAME]: clearFrame,
      [constants.KEY_SHORTCUTS.DELETE_FRAME]: deleteFrame,
      [constants.KEY_SHORTCUTS.GO_TO_FIRST_FRAME]: goToFirstFrame,
      [constants.KEY_SHORTCUTS.GO_TO_LAST_FRAME]: goToLastFrame,
      [constants.KEY_SHORTCUTS.GO_TO_NEXT_FRAME]: nextFrame,
      [constants.KEY_SHORTCUTS.GO_TO_PREVIOUS_FRAME]: previousFrame,
      [constants.KEY_SHORTCUTS.DOWNLOAD]: downloadMIDI,
      [constants.KEY_SHORTCUTS.HELP_MENU]: window.showHelp,
      [constants.KEY_SHORTCUTS.START_STOP]: () => isPlaying ? pauseAnimation() : startAnimation(),
    };
    const action = actions[key];
    if (action) {
      action();
    }
  }, [
    addFrame,
    clearFrame,
    copyFrame,
    deleteFrame,
    downloadMIDI,
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

  const USE_GAMEBOY = true;

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
            spacing={USE_GAMEBOY ? 6 : 1}
          >
            {row.map((item, columnIndex) => (
              <Grid item key={`column (${rowIndex},${columnIndex})`}>
                <Gameboy
                  useGameboy={USE_GAMEBOY}
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
        handleDownload={downloadMIDI}
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
        setVelocity={handleSetVelocity}
        subdivision={subdivision}
        totalFrames={frames.length}
        velocity={velocity}
      />
    </div>
  );
}
