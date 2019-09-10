import Add from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Clear from '@material-ui/icons/Clear';
import CloudDownload from '@material-ui/icons/CloudDownload';
import Delete from '@material-ui/icons/Delete';
import FastForward from '@material-ui/icons/FastForward';
import FastRewind from '@material-ui/icons/FastRewind';
import FileCopy from '@material-ui/icons/FileCopy'
import Grid from '@material-ui/core/Grid';
import Help from '@material-ui/icons/Help';
import HelpModal from '../HelpModal';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MenuItem from '@material-ui/core/MenuItem';
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import styles from './styles';
import Tooltip from '@material-ui/core/Tooltip';
import * as constants from '../../utils/constants';

export default (props) => {
  const {
    bpm,
    currentFrame,
    handleAddFrame,
    handleClear,
    handleCopyFrame,
    handleDeleteFrame,
    handleDownload,
    handleGoToFirstFrame,
    handleGoToLastFrame,
    handleNextFrame,
    handlePause,
    handlePreviousFrame,
    handleStart,
    handleTranslate,
    isPlaying,
    setBpm,
    setSubdivision,
    subdivision,
    totalFrames,
  } = props;
  const classes = styles();
  const [open, setOpen] = useState(false);

  const handleHelp = () => {
    setOpen(!open);
  };

  const translateMatrix = (direction) => () => {
    handleTranslate(direction);
  };

  useEffect(() => {
    window.showHelp = handleHelp;
  });

  return(
    <Grid className={classes['container']} container justify='center'>
      <Select
        className={classes['select']}
        input={<Input id="subdivision" />}
        onChange={(e) => setSubdivision(e.target.value)}
        value={subdivision}
      >
        {Object.keys(constants.NOTE_LENGTHS).map((noteLength) => (
          <MenuItem value={constants.NOTE_LENGTHS[noteLength].value} key={noteLength}>
            {constants.NOTE_LENGTHS[noteLength].text}
          </MenuItem>
        ))}
      </Select>
      <Input
        className={classes['tempo']}
        id='bpm'
        label='BPM'
        onChange={(e) => setBpm(e.target.value)}
        startAdornment={<InputAdornment disableTypography position="start">Tempo:</InputAdornment>}
        type='number'
        value={bpm}
      />
      <ButtonGroup className={classes['button-group']} color='primary' size='small' variant='contained'>
        {isPlaying ? (
          <Button size='small' onClick={handlePause}>
            <Tooltip title='Pause' enterDelay={500}>
              <Pause />
            </Tooltip>
          </Button>
        ) : (
          <Button size='small' onClick={handleStart} disabled={totalFrames === 1}>
            <Tooltip title='Play' enterDelay={500}>
              <PlayArrow />
            </Tooltip>
          </Button>
        )}
      </ButtonGroup>
      <ButtonGroup className={classes['button-group']} color='primary' size='small' variant='contained'>
        <Button size='small' onClick={handleGoToFirstFrame} disabled={isPlaying || (currentFrame === 0)}>
          <Tooltip title='First Frame' enterDelay={500}>
            <FastRewind />
          </Tooltip>
        </Button>
        <Button size='small' onClick={handlePreviousFrame} disabled={isPlaying || (currentFrame === 0)}>
          <Tooltip title='Previous Frame' enterDelay={500}>
            <KeyboardArrowLeft />
          </Tooltip>
        </Button>
        <Button className={classes['frames']} disabled color='secondary'>
          {currentFrame + 1} / {totalFrames}
        </Button>
        <Button size='small' onClick={handleNextFrame} disabled={isPlaying || (currentFrame === totalFrames - 1)}>
          <Tooltip title='Next Frame' enterDelay={500}>
            <KeyboardArrowRight />
          </Tooltip>
        </Button>
        <Button size='small' onClick={handleGoToLastFrame} disabled={isPlaying || (currentFrame === totalFrames - 1)}>
          <Tooltip title='Last Frame' enterDelay={500}>
            <FastForward />
          </Tooltip>
        </Button>
      </ButtonGroup>
      <ButtonGroup className={classes['button-group']} color='primary' size='small' variant='contained'>
        <Button size='small' onClick={handleAddFrame} disabled={isPlaying}>
          <Tooltip title='Add Frame' enterDelay={500}>
            <Add />
          </Tooltip>
        </Button>
        <Button size='small' onClick={handleCopyFrame} disabled={isPlaying}>
          <Tooltip title='Duplicate Frame' enterDelay={500}>
            <FileCopy />
          </Tooltip>
        </Button>
        <Button size='small' onClick={handleClear} disabled={isPlaying}>
          <Tooltip title='Clear Frame' enterDelay={500}>
            <Clear />
          </Tooltip>
        </Button>
        <Button size='small' onClick={handleDeleteFrame} disabled={isPlaying || totalFrames <= 1}>
          <Tooltip title='Delete Frame' enterDelay={500}>
            <Delete />
          </Tooltip>
        </Button>
      </ButtonGroup>
      <ButtonGroup className={classes['button-group']} color='primary' size='small' variant='contained'>
        <Button size='small' onClick={translateMatrix('left')} disabled={isPlaying}>
          <Tooltip title='Translate Left' enterDelay={500}>
            <ArrowBack />
          </Tooltip>
        </Button>
        <Button size='small' onClick={translateMatrix('up')} disabled={isPlaying}>
          <Tooltip title='Translate Up' enterDelay={500}>
            <ArrowUpward />
          </Tooltip>
        </Button>
        <Button size='small' onClick={translateMatrix('down')} disabled={isPlaying}>
          <Tooltip title='Translate Down' enterDelay={500}>
            <ArrowDownward />
          </Tooltip>
        </Button>
        <Button size='small' onClick={translateMatrix('right')} disabled={isPlaying}>
          <Tooltip title='Translate Right' enterDelay={500}>
            <ArrowForward />
          </Tooltip>
        </Button>
      </ButtonGroup>
      <ButtonGroup color='primary' size='small' variant='contained'>
        <Button onClick={handleDownload}>
          <Tooltip title='Download MIDI' enterDelay={500}>
            <CloudDownload />
          </Tooltip>
        </Button>
        <Button onClick={handleHelp}>
          <Tooltip title='Help' enterDelay={500}>
            <Help />
          </Tooltip>
        </Button>
      </ButtonGroup>
      <HelpModal onClose={handleHelp} open={open} />
    </Grid>
  )
}
