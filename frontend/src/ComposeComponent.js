import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

// components
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import Autosuggest from 'react-autosuggest';

// icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SendIcon from '@material-ui/icons/Send';

// contexts
import {ComposeContext} from './Contexts.js';

const useStyles = makeStyles((theme) => ({
  composeView: {
    ['@media (max-width:700px)']: {
      height: 1000,
    },
  },
  backbutton: {
  },
  toolbar: theme.mixins.toolbar,
  sendbutton: {
    marginLeft: '80%',
  },
  composeContainer: {
    padding: theme.spacing(2),
  },
  contentField: {
    padding: theme.spacing(4, 0, 0, 0),
  },
}));

/**
 * Compose Component
 * @return {JSX} JSX
 */
export default function ComposeComponent() {
  const classes = useStyles();
  const [alertOpen, setAlertOpen] = useState(false);

  const handleClickOpen = () => {
    setAlertOpen(true);
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <ComposeContext.Consumer>
      {({composeOpen, handleComposeToggle, handleContentChange,
        toNameStr, subStr, handleToNameChange, handleSubChange, contentStr,
        toEmailStr, handleToEmailChange, handleCallSendUpdate,
        handleEmailViewToggle, emailOpen}) => {
        return (
          <Drawer variant='persistent' anchor='bottom' open={composeOpen}>
            <div className={classes.composeView}>
              <AppBar position='fixed'>
                <Toolbar>
                  <IconButton color="inherit" aria-label="back"
                    edge="start" onClick={
                      () => {
                        if (toNameStr.length > 0 || toEmailStr.length > 0 ||
                          subStr.length > 0 || contentStr.length > 0) {
                          handleClickOpen();
                        } else {
                          handleComposeToggle();
                        }
                      }}
                    className={classes.backbutton}>
                    <ArrowBackIosIcon />
                  </IconButton>
                  <IconButton color="inherit" aria-label="send"
                    edge="end" className={classes.sendbutton} onClick={
                      () => {
                        handleCallSendUpdate();
                        handleComposeToggle();
                        if (emailOpen) {
                          handleEmailViewToggle();
                        }
                      }}>
                    <SendIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Dialog open={alertOpen} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">
                  {'Save changes'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Do you want to save your changes?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="primary" onClick={
                    () => {
                      handleClose();
                      handleComposeToggle();
                    }}>
                    No
                  </Button>
                  <Button onClick={handleClose} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
              <div className={classes.toolbar} />
              <div className={classes.composeContainer}>
                <TextField id='standard-full-width' placeholder='Name'
                  margin='normal' fullWidth value={toNameStr}
                  helperText='Name' onChange={handleToNameChange} />
                <TextField id='standard-full-width' placeholder='Email'
                  margin='normal' fullWidth value={toEmailStr}
                  helperText='Email' onChange={handleToEmailChange} />
                <TextField id='standard-full-width' placeholder='Subject'
                  margin='normal' fullWidth helperText='Subject'
                  value={subStr} onChange={handleSubChange} />
                <TextField id="standard-textarea" placeholder="Content"
                  multiline fullWidth variant='outlined' rows={15}
                  className={classes.contentField} value={contentStr}
                  onChange={handleContentChange} />
              </div>
            </div>
          </Drawer>
        );
      }}
    </ComposeContext.Consumer>
  );
}
