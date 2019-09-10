import Backdrop from '@material-ui/core/Backdrop/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import React from 'react';
import styles from './styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as constants from '../../utils/constants';

export default (props) => {
  const { onClose, open } = props;
  const classes = styles();
  return (
    <Modal
      aria-labelledby="keyboard-shortcuts"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes['paper']}>
          <h2 id="keyboard-shortcuts">Keyboard Shortcuts</h2>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell align="right">Shortcut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(constants.KEY_SHORTCUTS).map((action) => (
                <TableRow key={action}>
                  <TableCell component="th" scope="row">
                    {action}
                  </TableCell>
                  <TableCell align="right">
                    {constants.KEY_SHORTCUTS[action]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Fade>
    </Modal>
  )
}
